package com.ai.dashboard.ai.embedding.provider;

import com.ai.dashboard.ai.embedding.config.EmbeddingProperties;
import com.ai.dashboard.ai.embedding.exception.EmbeddingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Ollama-based implementation of EmbeddingProvider.
 *
 * <p>Calls the Ollama {@code /api/embed} endpoint with the configured model
 * (e.g. nomic-embed-text) and returns the embedding vector.</p>
 */
@Slf4j
@Component
public class OllamaEmbeddingProvider implements EmbeddingProvider {

    private static final String EMBED_PATH = "/api/embed";

    private final WebClient webClient;
    private final EmbeddingProperties properties;
    private final ObjectMapper objectMapper;

    public OllamaEmbeddingProvider(
            @Qualifier("ollamaWebClient") WebClient webClient,
            EmbeddingProperties properties,
            ObjectMapper objectMapper) {
        this.webClient = webClient;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @Override
    public List<Float> generateEmbedding(String text) {
        if (text == null || text.isBlank()) {
            throw new EmbeddingException(EmbeddingException.ErrorType.INVALID_REQUEST, "Text cannot be null or blank");
        }

        Instant start = Instant.now();
        String normalizedText = normalizeText(text);

        log.debug("Generating embedding (text length={})", normalizedText.length());

        try {
            List<Float> result = callWithRetry(normalizedText);
            long elapsed = Duration.between(start, Instant.now()).toMillis();
            
            validateEmbedding(result);
            
            log.debug("Embedding generated (dimension={}, elapsed={}ms)", result.size(), elapsed);
            return result;
        } catch (EmbeddingException e) {
            throw e;
        } catch (Exception e) {
            long elapsed = Duration.between(start, Instant.now()).toMillis();
            log.error("Embedding generation failed (elapsed={}ms)", elapsed, e);
            throw new EmbeddingException(EmbeddingException.ErrorType.UNKNOWN, "Failed to generate embedding: " + e.getMessage(), e);
        }
    }

    @Override
    public List<List<Float>> generateEmbeddings(List<String> texts) {
        if (texts == null || texts.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, List<Float>> cache = new HashMap<>();
        List<List<Float>> results = new ArrayList<>(texts.size());

        for (String text : texts) {
            String normalized = normalizeText(text);
            List<Float> embedding = cache.computeIfAbsent(normalized, this::generateEmbedding);
            results.add(embedding);
        }

        return results;
    }

    @Override
    public boolean health() {
        try {
            webClient.get().uri("/api/tags")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();
            return true;
        } catch (Exception e) {
            log.warn("Embedding health check failed: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public String getName() {
        return "ollama-" + properties.getModel();
    }

    /**
     * Generate embeddings for a batch of texts.
     */
    private List<List<Float>> generateBatch(List<String> texts) {
        // For now, process individually. Future: implement true batch API call
        return texts.stream()
                .map(this::generateEmbedding)
                .collect(Collectors.toList());
    }

    private List<Float> callWithRetry(String text) {
        int retries = 0;
        long backoff = properties.getRetryBackoff().toMillis();

        while (true) {
            try {
                return callEmbeddingApi(text);
            } catch (WebClientResponseException e) {
                retries++;
                if (!isTransientError(e.getStatusCode().value()) || retries >= properties.getMaxRetries()) {
                    log.error("Embedding API error: status={}", e.getStatusCode());
                    throw new EmbeddingException(
                            EmbeddingException.ErrorType.MODEL_UNAVAILABLE,
                            "Embedding API returned error: " + e.getStatusCode());
                }
                
                log.warn("Embedding attempt {} failed, status={}, retrying in {}ms", 
                        retries, e.getStatusCode(), backoff);
                sleep(backoff);
                backoff = Math.min(backoff * 2, properties.getMaxBackoff().toMillis());
            } catch (WebClientRequestException e) {
                retries++;
                if (retries >= properties.getMaxRetries()) {
                    log.error("Embedding connection failed after {} retries", retries);
                    throw new EmbeddingException(
                            EmbeddingException.ErrorType.CONNECTION_REFUSED,
                            "Cannot connect to embedding service");
                }
                
                log.warn("Embedding connection attempt {} failed, retrying in {}ms", retries, backoff);
                sleep(backoff);
                backoff = Math.min(backoff * 2, properties.getMaxBackoff().toMillis());
            }
        }
    }

    private boolean isTransientError(int statusCode) {
        return statusCode == 502 || statusCode == 503 || statusCode == 504;
    }

    private List<Float> callEmbeddingApi(String text) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", properties.getModel());
        body.put("input", text);

        String json = webClient.post()
                .uri(EMBED_PATH)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(properties.getTimeout())
                .block();

        return parseEmbedding(json);
    }

    private List<Float> parseEmbedding(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode embeddings = root.get("embeddings");
            if (embeddings == null || !embeddings.isArray() || embeddings.isEmpty()) {
                throw new EmbeddingException(EmbeddingException.ErrorType.INVALID_RESPONSE, "No embeddings in response");
            }

            JsonNode first = embeddings.get(0);
            if (!first.isArray()) {
                throw new EmbeddingException(EmbeddingException.ErrorType.INVALID_RESPONSE, "Unexpected embedding format");
            }

            List<Float> result = new ArrayList<>(first.size());
            for (JsonNode value : first) {
                result.add(value.floatValue());
            }
            return result;
        } catch (EmbeddingException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to parse embedding response: {}", e.getMessage());
            throw new EmbeddingException(EmbeddingException.ErrorType.INVALID_RESPONSE, 
                    "Failed to parse embedding response", e);
        }
    }

    private void validateEmbedding(List<Float> embedding) {
        if (embedding == null || embedding.isEmpty()) {
            throw new EmbeddingException(EmbeddingException.ErrorType.INVALID_VECTOR, "Embedding is null or empty");
        }

        if (properties.getExpectedDimension() != null && embedding.size() != properties.getExpectedDimension()) {
            throw new EmbeddingException(EmbeddingException.ErrorType.DIMENSION_MISMATCH, 
                    "Embedding dimension mismatch: expected " + properties.getExpectedDimension() + 
                    ", got " + embedding.size());
        }

        for (int i = 0; i < embedding.size(); i++) {
            Float value = embedding.get(i);
            if (value == null || value.isNaN() || value.isInfinite()) {
                throw new EmbeddingException(EmbeddingException.ErrorType.INVALID_VECTOR, 
                        "Invalid embedding value at index " + i + ": " + value);
            }
        }
    }

    private String normalizeText(String text) {
        if (text == null) {
            return "";
        }
        // Trim, normalize line endings, and limit length
        return text.trim()
                .replaceAll("\\r\\n", "\n")
                .replaceAll("\\r", "\n");
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new EmbeddingException(EmbeddingException.ErrorType.UNKNOWN, "Retry interrupted");
        }
    }
}