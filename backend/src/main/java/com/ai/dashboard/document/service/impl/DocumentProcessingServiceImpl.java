package com.ai.dashboard.document.service.impl;

import com.ai.dashboard.document.entity.Document;
import com.ai.dashboard.document.repository.DocumentRepository;
import com.ai.dashboard.document.service.DocumentProcessingService;
import com.ai.dashboard.document.service.ParserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Asynchronous background worker executing document text extraction, chunking, and embedding generation.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentProcessingServiceImpl implements DocumentProcessingService {

    private final DocumentRepository documentRepository;
    private final ParserService parserService;
    private final com.ai.dashboard.ai.rag.service.RagService ragService;

    @Override
    @Async("documentProcessingExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processDocumentAsync(Long documentId) {
        log.info("Processing started for documentId={}", documentId);

        Document document = documentRepository.findById(documentId).orElse(null);
        if (document == null) {
            log.error("Document not found for async processing, documentId={}", documentId);
            return;
        }

        try {
            document.setProcessingStatus(Document.ProcessingStatus.PROCESSING);
            documentRepository.saveAndFlush(document);
            log.info("Status updated to PROCESSING for documentId={}", documentId);

            parserService.extractText(document);

            log.info("Auto-indexing documentId={}", documentId);
            ragService.reindexDocument(documentId);

            // Re-fetch managed entity
            document = documentRepository.findById(documentId).orElse(document);
            log.info("Embedding completed / Qdrant indexing completed for documentId={}", documentId);

            document.setProcessingStatus(Document.ProcessingStatus.COMPLETED);
            documentRepository.saveAndFlush(document);
            log.info("Processing completed successfully for documentId={}", documentId);
        } catch (Exception e) {
            log.error("Processing failed for documentId={}: {}", documentId, e.getMessage(), e);
            try {
                Document failDoc = documentRepository.findById(documentId).orElse(document);
                if (failDoc != null) {
                    failDoc.setProcessingStatus(Document.ProcessingStatus.FAILED);
                    documentRepository.saveAndFlush(failDoc);
                }
            } catch (Exception inner) {
                log.error("Failed to persist FAILED status for documentId={}", documentId, inner);
            }
        }
    }
}
