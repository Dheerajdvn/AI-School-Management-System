package com.ai.dashboard.ai.vector.service;

import com.ai.dashboard.ai.vector.dto.SearchResult;
import com.ai.dashboard.ai.vector.dto.StoredDocument;

import java.util.List;

/**
 * Service interface for vector store operations.
 */
public interface VectorStoreService {

    /**
     * Create the vector collection if it does not exist.
     */
    void createCollection();

    /**
     * Store a single document embedding in the vector store.
     *
     * @param document the document with vector and metadata
     */
    void storeEmbedding(StoredDocument document);

    /**
     * Store multiple document embeddings in the vector store.
     *
     * @param documents the documents with vectors and metadata
     */
    void storeEmbeddings(List<StoredDocument> documents);

    /**
     * Search for the most similar documents.
     *
     * @param embedding the query embedding vector
     * @param topK      the number of results to return
     * @return list of search results with scores and metadata
     */
    List<SearchResult> searchSimilar(List<Float> embedding, int topK);

    /**
     * Search for the most similar documents with an optional courseId filter.
     */
    default List<SearchResult> searchSimilar(List<Float> embedding, int topK, Long courseId) {
        return searchSimilar(embedding, topK);
    }

    /**
     * Delete all vectors belonging to the given document.
     *
     * @param documentId the document identifier
     */
    void deleteDocumentVectors(long documentId);

    /**
     * Check if the vector store is healthy.
     *
     * @return true if healthy
     */
    boolean health();
}