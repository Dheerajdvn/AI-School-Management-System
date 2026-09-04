package com.ai.dashboard.document.controller;

import com.ai.dashboard.document.dto.DocumentResponse;
import com.ai.dashboard.document.dto.UploadDocumentRequest;
import com.ai.dashboard.document.service.DocumentService;
import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.ai.dashboard.document.dto.DocumentContentResponse;
import com.ai.dashboard.document.repository.DocumentContentRepository;

/**
 * Document REST endpoints.
 *
 * <p>Access control:
 * <ul>
 *   <li>Upload/Delete: ADMIN and TEACHER only</li>
 *   <li>Get documents: All authenticated users (students restricted to enrolled courses)</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@Tag(name = "Documents", description = "Document Management APIs")
public class DocumentController {

    private final DocumentService documentService;
    private final DocumentContentRepository documentContentRepository;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Upload a document")
    public ApiResponse<DocumentResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "courseId", required = false) Long courseId,
            @RequestParam(value = "documentType", required = false) String documentType,
            Authentication authentication) {

        log.info("Uploading document: filename={}, size={}, contentType={}, courseId={}, documentType={}",
                file != null ? file.getOriginalFilename() : "null",
                file != null ? file.getSize() : 0,
                file != null ? file.getContentType() : "null",
                courseId, documentType);

        UploadDocumentRequest request = UploadDocumentRequest.builder()
                .file(file)
                .courseId(courseId)
                .documentType(documentType)
                .build();

        DocumentResponse response = documentService.upload(request, extractUserId(authentication));
        return ApiResponse.success(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get all documents")
    public ApiResponse<PagedResponse<DocumentResponse>> getAll(
            Pageable pageable,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "documentType", required = false) String documentType,
            @RequestParam(value = "courseId", required = false) Long courseId
    ) {
        log.info("Getting all documents, page={}, search={}, documentType={}, courseId={}", pageable.getPageNumber(), search, documentType, courseId);
        Page<DocumentResponse> documents = documentService.getAll(pageable, search, documentType, courseId);
        PagedResponse<DocumentResponse> response = PagedResponse.<DocumentResponse>builder()
                .content(documents.getContent())
                .page(documents.getNumber())
                .size(documents.getSize())
                .totalElements(documents.getTotalElements())
                .totalPages(documents.getTotalPages())
                .last(documents.isLast())
                .first(documents.isFirst())
                .build();
        return ApiResponse.success(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get document by ID")
    public ApiResponse<DocumentResponse> getById(
            @PathVariable Long id,
            Authentication authentication) {

        log.info("Getting document: {}", id);
        DocumentResponse response = documentService.getById(
                id, extractUserId(authentication), getCurrentUserRole(authentication));
        return ApiResponse.success(response);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Download a document")
    public ResponseEntity<Resource> download(
            @PathVariable Long id,
            Authentication authentication) {

        log.info("Downloading document: {}", id);
        Resource resource = documentService.download(
                id, extractUserId(authentication), getCurrentUserRole(authentication));

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/{id}/content")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get extracted text/content for a document")
    public ApiResponse<DocumentContentResponse> getContent(
            @PathVariable Long id,
            Authentication authentication) {

        log.info("Getting content for document: {}", id);
        // Validate access and existence using existing service (reuses access checks)
        documentService.getById(id, extractUserId(authentication), getCurrentUserRole(authentication));

        return documentContentRepository.findByDocumentId(id)
                .map(dc -> ApiResponse.success(DocumentContentResponse.builder()
                        .id(dc.getId())
                        .documentId(dc.getDocument().getId())
                        .extractedText(dc.getExtractedText())
                        .extractedAt(dc.getExtractedAt())
                        .build()))
                .orElse(ApiResponse.success(null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Delete a document")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            Authentication authentication) {

        log.info("Deleting document: {}", id);
        documentService.delete(id, extractUserId(authentication), getCurrentUserRole(authentication));
        return ApiResponse.success(null);
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication == null) {
            return null;
        }
        Object credentials = authentication.getCredentials();
        return credentials instanceof Long ? (Long) credentials : null;
    }

    private String getCurrentUserRole(Authentication authentication) {
        if (authentication == null) {
            return "ROLE_STUDENT";
        }
        return authentication.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("ROLE_STUDENT");
    }
}
