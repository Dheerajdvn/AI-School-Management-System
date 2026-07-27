package com.ai.dashboard.document.service.impl;

import com.ai.dashboard.document.dto.DocumentResponse;
import com.ai.dashboard.document.dto.UploadDocumentRequest;
import com.ai.dashboard.document.entity.Document;
import com.ai.dashboard.document.repository.DocumentRepository;
import com.ai.dashboard.document.service.DocumentService;
import com.ai.dashboard.document.service.ParserService;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.EnrollmentRepository;
import com.ai.dashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.ai.dashboard.document.service.DocumentProcessingService;
import com.ai.dashboard.document.repository.DocumentContentRepository;
import com.ai.dashboard.ai.rag.repository.DocumentChunkRepository;
import com.ai.dashboard.ai.vector.provider.VectorStoreProvider;

/**
 * Implementation of DocumentService with local file storage.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DocumentServiceImpl implements DocumentService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "pdf", "docx", "doc", "txt", "md", "pptx", "ppt", "xlsx", "xls", "csv", "jpg", "jpeg", "png", "epub", "rtf"
    );
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    private final DocumentRepository documentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ParserService parserService;
    private final UserRepository userRepository;
    private final DocumentProcessingService documentProcessingService;
    private final DocumentContentRepository documentContentRepository;
    private final DocumentChunkRepository documentChunkRepository;
    private final VectorStoreProvider vectorStoreProvider;

    private final Path storagePath = Paths.get("uploads/documents").toAbsolutePath().normalize();

    @Override
    public DocumentResponse upload(UploadDocumentRequest request, Long userId) {
        MultipartFile file = request.getFile();

        validateFile(file);

        User uploadedBy = null;
        if (userId != null) {
            uploadedBy = userRepository.findById(userId).orElse(null);
        }
        if (uploadedBy == null) {
            uploadedBy = userRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("No user found for document upload"));
        }
        Course course = null;
        if (request.getCourseId() != null) {
            course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        }

        try {
            log.info("Step: Save physical file started");
            Files.createDirectories(storagePath);
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path targetPath = storagePath.resolve(filename);
            Files.copy(file.getInputStream(), targetPath);
            log.info("Step: Save physical file completed");

            Document.DocumentType documentType = Document.DocumentType.OTHER;
            if (request.getDocumentType() != null) {
                try {
                    documentType = Document.DocumentType.valueOf(request.getDocumentType());
                } catch (IllegalArgumentException e) {
                    log.warn("Unknown document type: {}, using OTHER", request.getDocumentType());
                }
            }

            log.info("Step: Save Document entity started");
            Document document = Document.builder()
                    .filename(filename)
                    .originalFilename(file.getOriginalFilename())
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .uploadedBy(uploadedBy)
                    .uploadTime(LocalDateTime.now())
                    .documentType(documentType)
                    .course(course)
                    .storagePath(targetPath.toString())
                    .processingStatus(Document.ProcessingStatus.PENDING)
                    .build();

            Document saved = documentRepository.save(document);
            documentRepository.flush();
            log.info("Upload started: documentId={}", saved.getId());

            // Trigger background processing asynchronously
            try {
                documentProcessingService.processDocumentAsync(saved.getId());
                log.info("Async background processing triggered for documentId={}", saved.getId());
            } catch (Exception e) {
                log.error("Failed to trigger async processing for documentId={}: {}", saved.getId(), e.getMessage(), e);
            }

            DocumentResponse response = toResponse(saved);
            log.info("Upload completed & HTTP response returning immediately with status=PENDING for documentId={}", saved.getId());
            return response;
        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    @Override
    public Page<DocumentResponse> getAll(Pageable pageable) {
        return getAll(pageable, null, null, null);
    }

    @Override
    public Page<DocumentResponse> getAll(Pageable pageable, String q, String documentType, Long courseId) {
        // Validate documentType parameter if present
        if (documentType != null && !documentType.isBlank()) {
            try {
                Document.DocumentType.valueOf(documentType);
            } catch (IllegalArgumentException e) {
                documentType = null; // Ignore invalid documentType filter instead of throwing 400
            }
        }

        org.springframework.data.jpa.domain.Specification<Document> spec = org.springframework.data.jpa.domain.Specification
                .allOf(
                        com.ai.dashboard.document.repository.DocumentSpecifications.matchesQuery(q),
                        com.ai.dashboard.document.repository.DocumentSpecifications.hasDocumentType(documentType),
                        com.ai.dashboard.document.repository.DocumentSpecifications.hasCourseId(courseId));

        Page<Document> documents = documentRepository.findAll(spec, pageable);
        return documents.map(this::toResponse);
    }

    @Override
    public DocumentResponse getById(Long id, Long userId, String userRole) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (isStudent(userRole)) {
            validateStudentAccess(document, userId);
        }

        return toResponse(document);
    }

    @Override
    public org.springframework.core.io.Resource download(Long id, Long userId, String userRole) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (isStudent(userRole)) {
            validateStudentAccess(document, userId);
        }

        try {
            java.nio.file.Path path = java.nio.file.Paths.get(document.getStoragePath());
            if (!java.nio.file.Files.exists(path)) {
                throw new ResourceNotFoundException("File not found on disk");
            }
            return new UrlResource(path.toUri());
        } catch (Exception e) {
            log.error("Failed to load file", e);
            throw new ResourceNotFoundException("File not found: " + e.getMessage());
        }
    }

    @Override
    public void delete(Long id, Long userId, String userRole) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (isStudent(userRole)) {
            throw new AccessDeniedException("Students cannot delete documents");
        }

        if (isTeacher(userRole) && !document.getUploadedBy().getId().equals(userId)) {
            throw new AccessDeniedException("You can only delete your own documents");
        }

        // 1. Delete Qdrant vectors
        try {
            vectorStoreProvider.delete(id);
            log.info("Deleted Qdrant vectors for documentId={}", id);
        } catch (Exception e) {
            log.warn("Failed to delete vectors from vector store for documentId={}: {}", id, e.getMessage());
        }

        // 2. Delete document chunks from db
        try {
            documentChunkRepository.deleteByDocumentId(id);
            log.info("Deleted database chunks for documentId={}", id);
        } catch (Exception e) {
            log.warn("Failed to delete chunks for documentId={}: {}", id, e.getMessage());
        }

        // 3. Delete document contents from db
        try {
            documentContentRepository.deleteByDocumentId(id);
            log.info("Deleted document content for documentId={}", id);
        } catch (Exception e) {
            log.warn("Failed to delete document content for documentId={}: {}", id, e.getMessage());
        }

        // 4. Delete physical file
        try {
            Files.deleteIfExists(Paths.get(document.getStoragePath()));
        } catch (IOException e) {
            log.warn("Failed to delete file from storage: {}", document.getStoragePath());
        }

        // 5. Delete document entity from db
        documentRepository.delete(document);
        log.info("Document deleted successfully: {}", id);
    }

    // ------------------------------------------------------------------
    // Helper methods
    // ------------------------------------------------------------------

    private void validateFile(MultipartFile file) {
        String extension = getExtension(file.getOriginalFilename()).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("File type not allowed: " + extension);
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum of 50MB");
        }
    }

    private String getExtension(String filename) {
        return filename != null && filename.contains(".")
                ? filename.substring(filename.lastIndexOf(".") + 1)
                : "";
    }

    private boolean isStudent(String role) {
        return "ROLE_STUDENT".equals(role);
    }

    private boolean isTeacher(String role) {
        return "ROLE_TEACHER".equals(role);
    }

    private void validateStudentAccess(Document document, Long userId) {
        if (document.getCourse() == null) {
            throw new AccessDeniedException("Cannot access document without course");
        }
        boolean enrolled = enrollmentRepository.existsByStudentIdAndCourseId(userId, document.getCourse().getId());
        if (!enrolled) {
            throw new AccessDeniedException("Not enrolled in this course");
        }
    }

    private DocumentResponse toResponse(Document document) {
        return DocumentResponse.builder()
                .id(document.getId())
                .filename(document.getFilename())
                .originalFilename(document.getOriginalFilename())
                .contentType(document.getContentType())
                .fileSize(document.getFileSize())
                .uploadedById(document.getUploadedBy().getId())
                .uploadedByName(document.getUploadedBy().getUsername())
                .uploadTime(document.getUploadTime())
                .documentType(document.getDocumentType().name())
                .courseId(document.getCourse() != null ? document.getCourse().getId() : null)
                .courseCode(document.getCourse() != null ? document.getCourse().getCourseCode() : null)
                .processingStatus(document.getProcessingStatus().name())
                .build();
    }
}
