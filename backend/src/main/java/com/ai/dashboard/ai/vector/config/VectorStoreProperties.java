package com.ai.dashboard.ai.vector.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configuration properties for the vector store.
 *
 * <p>Reads the {@code ai.vector.*} properties from {@code application.yml}.</p>
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "ai.vector")
public class VectorStoreProperties {

    /** Provider name, e.g. "qdrant". */
    private String provider = "qdrant";

    /** Qdrant server host. */
    private String host = "localhost";

    /** Qdrant server port. */
    private int port = 6333;

    /** Collection name for storing document embeddings. */
    private String collection = "course_documents";

    /** Vector dimension (must match the embedding model output). */
    private int dimension = 768;

    /** Request timeout. */
    private Duration timeout = Duration.ofSeconds(30);
}