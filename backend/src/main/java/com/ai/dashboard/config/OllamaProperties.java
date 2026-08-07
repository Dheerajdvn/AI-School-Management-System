package com.ai.dashboard.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Bound configuration for the local Ollama LLM and RAG pipeline.
 *
 * <p>Reads the {@code ai.ollama.*} properties from {@code application.yml}.</p>
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "ai.ollama")
public class OllamaProperties {

    /** Base URL of the Ollama server, e.g. http://localhost:11434 */
    private String baseUrl = "http://localhost:11434";

    /** Model name to invoke, e.g. qwen2.5-coder:3b */
    private String model = "qwen2.5-coder:3b";

    /** Sampling temperature (0 = deterministic). */
    private double temperature = 0.2;

    /** Request timeout in seconds. */
    private long timeout = 120;

    /** Maximum tokens the model may generate. */
    private int maxTokens = 2048;

    /** Maximum retry attempts for failed requests. */
    private int maxRetries = 3;


    /** Top K retrieval for vector search */
    private int topK = 5;

    /** Similarity threshold for filtering search results */
    private double similarityThreshold = 0.7;

    /** Chunk size in words for document chunking */
    private int chunkSize = 750;

    /** Chunk overlap in words */
    private int chunkOverlap = 100;

    /** Embedding batch size for processing */
    private int embeddingBatchSize = 10;

    /** Maximum context tokens to send to LLM */
    private int maxContextTokens = 2000;

    /** Maximum conversation history tokens */
    private int maxHistoryTokens = 1000;

    /** Maximum conversation turns to retain */
    private int maxConversationTurns = 20;


    /** Enable streaming responses */
    private boolean streamingEnabled = true;

    /** Stream buffer size */
    private int streamBufferSize = 1024;
}
