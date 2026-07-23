package com.ai.dashboard.document.service;

import com.ai.dashboard.document.dto.DocumentResponse;
import com.ai.dashboard.document.dto.UploadDocumentRequest;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for document management.
 */
public interface DocumentService {

    /**
     * Upload a document.
     */
    DocumentResponse upload(UploadDocumentRequest request, Long userId);

    /**
     * Get all documents with pagination.
     */
    Page<DocumentResponse> getAll(Pageable pageable);

    /**
     * Get documents with optional search and filters (backwards compatible).
     */
    Page<DocumentResponse> getAll(Pageable pageable, String q, String documentType, Long courseId);

    /**
     * Get a document by ID.
     */
    DocumentResponse getById(Long id, Long userId, String userRole);

    /**
     * Download a document.
     */
    Resource download(Long id, Long userId, String userRole);

    /**
     * Delete a document.
     */
    void delete(Long id, Long userId, String userRole);
}