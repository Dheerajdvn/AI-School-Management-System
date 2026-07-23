package com.ai.dashboard.document.service;

import com.ai.dashboard.document.entity.Document;

/**
 * Service interface for document text extraction.
 */
public interface ParserService {

    /**
     * Extract text from the given document using the appropriate parser,
     * persist the extracted content, and update the document's processing status.
     *
     * @param document the document entity to process
     */
    void extractText(Document document);
}