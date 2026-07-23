package com.ai.dashboard.ai.embedding.provider;

import java.util.List;

/**
 * Contract for embedding model providers.
 */
public interface EmbeddingProvider {

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
     * Check if the provider is available.
     *
     * @return true if the provider is healthy
     */
    boolean health();

    /**
     * Get the provider name.
     *
     * @return the provider identifier
     */
    String getName();
}