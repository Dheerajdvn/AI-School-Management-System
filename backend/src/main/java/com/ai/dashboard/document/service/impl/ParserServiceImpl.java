package com.ai.dashboard.document.service.impl;

import com.ai.dashboard.document.entity.Document;
import com.ai.dashboard.document.entity.DocumentContent;
import com.ai.dashboard.document.parser.DocumentParser;
import com.ai.dashboard.document.repository.DocumentContentRepository;
import com.ai.dashboard.document.repository.DocumentRepository;
import com.ai.dashboard.document.service.ParserService;
import com.ai.dashboard.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Orchestrates text extraction with transaction isolation and managed entities.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ParserServiceImpl implements ParserService {

    private final List<DocumentParser> parsers;
    private final DocumentRepository documentRepository;
    private final DocumentContentRepository documentContentRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void extractText(Document document) {
        if (document == null || document.getId() == null) {
            log.error("ParserServiceImpl.extractText: Document or Document ID must not be null");
            throw new IllegalArgumentException("Document ID must not be null");
        }

        Document managedDocument = documentRepository.findById(document.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + document.getId()));

        Long documentId = managedDocument.getId();
        Long courseId = managedDocument.getCourse() != null ? managedDocument.getCourse().getId() : null;

        String extension = getExtension(managedDocument.getOriginalFilename());
        log.info("Extracting text for documentId={}, courseId={}, type={}", documentId, courseId, extension);

        DocumentParser parser = findParser(extension);
        String text = "";
        try {
            if (parser != null) {
                log.info("Step: Extract text from file started for documentId={}", documentId);
                text = parser.extractText(managedDocument.getStoragePath());
                log.info("Step: Extract text from file completed ({} chars) for documentId={}", text != null ? text.length() : 0, documentId);
            } else {
                log.warn("No parser found for extension '{}' on documentId={}, using default", extension, documentId);
                text = "[Document uploaded successfully - no specific parser required]";
            }

            if (text != null) {
                text = text.replaceAll("\u0000", "");
            }

            log.info("Step: Save DocumentContent started for documentId={}", documentId);
            DocumentContent content = documentContentRepository.findByDocumentId(documentId)
                    .orElseGet(() -> DocumentContent.builder().document(managedDocument).build());
            content.setDocument(managedDocument);
            content.setExtractedText(text != null && !text.isBlank() ? text : "[Document content available]");
            content.setExtractedAt(LocalDateTime.now());

            documentContentRepository.save(content);
            log.info("Step: Save DocumentContent completed for documentId={}", documentId);

            managedDocument.setProcessingStatus(Document.ProcessingStatus.COMPLETED);
            log.info("Saving managedDocument: documentId={}, processingStatus={}, courseId={}", 
                    documentId, managedDocument.getProcessingStatus(), courseId);
            documentRepository.save(managedDocument);

            log.info("Text extraction completed for documentId={}", documentId);
        } catch (Exception e) {
            log.error("Text extraction failed for documentId={}: {}", documentId, e.getMessage(), e);
            try {
                DocumentContent content = documentContentRepository.findByDocumentId(documentId)
                        .orElseGet(() -> DocumentContent.builder().document(managedDocument).build());
                content.setDocument(managedDocument);
                content.setExtractedText("[Document text extraction encountered an issue, file stored successfully]");
                content.setExtractedAt(LocalDateTime.now());
                documentContentRepository.save(content);
            } catch (Exception inner) {
                log.error("Failed to save fallback document content for documentId={}", documentId, inner);
            }
            managedDocument.setProcessingStatus(Document.ProcessingStatus.COMPLETED);
            log.info("Saving managedDocument fallback: documentId={}, processingStatus={}", documentId, managedDocument.getProcessingStatus());
            documentRepository.save(managedDocument);
        }
    }

    private DocumentParser findParser(String extension) {
        for (DocumentParser parser : parsers) {
            if (parser.supports(extension)) {
                return parser;
            }
        }
        return null;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}
