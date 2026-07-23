package com.ai.dashboard.ai.embedding.service;

import java.util.List;

/**
 * Service interface for embedding generation.
 */
public interface EmbeddingService {

    /**
     * Generate an embedding vector for the given text.
     *
     * @param text the input text
     * @return the embedding vector
     */
    List<Float> generateEmbedding(String text);

    /**
     * Generate embedding vectors for a batch of texts.
     *
     * @param texts the input texts
     * @return a list of embedding vectors, one per input text
     */
    List<List<Float>> generateEmbeddings(List<String> texts);

    /**
     * Check if the embedding service is healthy.
     *
     * @return true if the service is healthy
     */
    boolean health();
}