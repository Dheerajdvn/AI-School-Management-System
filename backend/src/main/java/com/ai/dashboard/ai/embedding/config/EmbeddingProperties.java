package com.ai.dashboard.ai.embedding.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configuration properties for the embedding service.
 *
 * <p>Reads the {@code ai.embedding.*} properties from {@code application.yml}.</p>
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "ai.embedding")
public class EmbeddingProperties {

    /** Provider name, e.g. "ollama". */
    private String provider = "ollama";

    /** Model name for embeddings, e.g. "nomic-embed-text". */
    private String model = "nomic-embed-text";

    /** Request timeout. */
    private Duration timeout = Duration.ofSeconds(30);

    /** Base URL of the embedding provider server. */
    private String baseUrl = "http://localhost:11434";

    /** Maximum number of retries for failed embedding requests. */
    private int maxRetries = 3;

    /** Initial backoff duration for retries. */
    private Duration retryBackoff = Duration.ofSeconds(1);

    /** Maximum backoff duration for retries. */
    private Duration maxBackoff = Duration.ofSeconds(30);

    /** Batch size for embedding generation. */
    private int batchSize = 16;

    /** Whether to validate generated embeddings. */
    private boolean validationEnabled = true;

    /** Expected embedding dimension (optional, for validation). */
    private Integer expectedDimension = 768;

    /** Maximum chunk length for embedding. */
    private int maxChunkLength = 8192;
}