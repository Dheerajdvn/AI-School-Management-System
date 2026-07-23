package com.ai.dashboard.ai.vector.provider;

import com.ai.dashboard.ai.vector.dto.SearchResult;
import com.ai.dashboard.ai.vector.dto.StoredDocument;

import java.util.List;

/**
 * Contract for vector store providers.
 */
public interface VectorStoreProvider {

    /**
     * Create a collection if it does not exist.
     */
    void createCollection();

    /**
     * Upsert (insert or update) a single document vector.
     *
     * @param document the document with vector and metadata
     */
    void upsert(StoredDocument document);

    /**
     * Search for the most similar vectors.
     *
     * @param embedding the query embedding vector
     * @param topK      the number of results to return
     * @return list of search results with scores and metadata
     */
    List<SearchResult> search(List<Float> embedding, int topK);

    /**
     * Search for the most similar vectors with an optional courseId filter.
     */
    default List<SearchResult> search(List<Float> embedding, int topK, Long courseId) {
        return search(embedding, topK);
    }

    /**
     * Delete all vectors belonging to the given document.
     *
     * @param documentId the document identifier
     */
    void delete(long documentId);

    /**
     * Check if the vector store is reachable and healthy.
     *
     * @return true if healthy
     */
    boolean health();
}