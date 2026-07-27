package com.ai.dashboard.document.service;

/**
 * Service interface for asynchronous document processing pipeline.
 */
public interface DocumentProcessingService {

    /**
     * Process document text extraction, chunking, embedding, and vector storage asynchronously.
     *
     * @param documentId the ID of the document entity to process
     */
    void processDocumentAsync(Long documentId);
}
