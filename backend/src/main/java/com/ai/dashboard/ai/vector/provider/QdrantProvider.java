package com.ai.dashboard.ai.vector.provider;

import com.ai.dashboard.ai.vector.config.VectorStoreProperties;
import com.ai.dashboard.ai.vector.dto.SearchResult;
import com.ai.dashboard.ai.vector.dto.StoredDocument;
import com.ai.dashboard.ai.vector.exception.VectorStoreException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Qdrant-based implementation of VectorStoreProvider.
 *
 * <p>Uses the Qdrant REST API for collection management, point upsert,
 * similarity search, and point deletion.</p>
 */
@Slf4j
@Component
public class QdrantProvider implements VectorStoreProvider {

    private static final int MAX_RETRIES = 3;

    private final WebClient webClient;
    private final VectorStoreProperties properties;
    private final ObjectMapper objectMapper;

    public QdrantProvider(@Qualifier("qdrantWebClient") WebClient webClient,
                          VectorStoreProperties properties,
                          ObjectMapper objectMapper) {
        this.webClient = webClient;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @Override
    public void createCollection() {
        String collection = properties.getCollection();
        log.info("Creating Qdrant collection '{}' if not exists (dimension={})", collection, properties.getDimension());

        Instant start = Instant.now();
        try {
            ObjectNode body = objectMapper.createObjectNode();
            body.put("name", collection);

            ObjectNode vectors = body.putObject("vectors");
            vectors.put("size", properties.getDimension());
            vectors.put("distance", "Cosine");

            String response = webClient.put()
                    .uri("/collections/{name}", collection)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            long elapsed = Duration.between(start, Instant.now()).toMillis();
            log.info("Qdrant collection '{}' ready (elapsed={}ms, response={})", collection, elapsed, truncate(response));
        } catch (Exception e) {
            long elapsed = Duration.between(start, Instant.now()).toMillis();
            String msg = e.getMessage() != null ? e.getMessage() : "";
            if (msg.contains("409") || msg.contains("Conflict") || msg.contains("already exists")) {
                log.info("Qdrant collection '{}' already exists (elapsed={}ms)", collection, elapsed);
            } else {
                log.warn("Qdrant collection creation attempt failed after {}ms: {}", elapsed, msg);
            }
        }
    }

    @Override
    public void upsert(StoredDocument document) {
        String collection = properties.getCollection();
        log.info("Upserting point for document {} chunk {} into '{}'", document.getDocumentId(), document.getChunkId(), collection);

        Instant start = Instant.now();
        try {
            callWithRetry(() -> doUpsert(collection, document));
            long elapsed = Duration.between(start, Instant.now()).toMillis();
            log.info("Upsert completed for document {} chunk {} (elapsed={}ms)", document.getDocumentId(), document.getChunkId(), elapsed);
        } catch (Exception e) {
            long elapsed = Duration.between(start, Instant.now()).toMillis();
            log.error("Upsert failed for document {} chunk {} after {}ms: {}", document.getDocumentId(), document.getChunkId(), elapsed, e.getMessage());
            throw new VectorStoreException("Failed to upsert vector: " + e.getMessage(), e);
        }
    }

    @Override
    public List<SearchResult> search(List<Float> embedding, int topK) {
        return search(embedding, topK, null);
    }

    @Override
    public List<SearchResult> search(List<Float> embedding, int topK, Long courseId) {
        String collection = properties.getCollection();
        log.info("Searching top {} in '{}' (dimension={}, courseId={})", topK, collection, embedding.size(), courseId);

        Instant start = Instant.now();
        try {
            List<SearchResult> results = callWithRetry(() -> doSearch(collection, embedding, topK, courseId));
            long elapsed = Duration.between(start, Instant.now()).toMillis();
            log.info("Search completed ({} results, elapsed={}ms)", results.size(), elapsed);
            return results;
        } catch (Exception e) {
            long elapsed = Duration.between(start, Instant.now()).toMillis();
            log.error("Search failed after {}ms: {}", elapsed, e.getMessage());
            throw new VectorStoreException("Failed to search vectors: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(long documentId) {
        String collection = properties.getCollection();
        log.info("Deleting all vectors for document {} from '{}'", documentId, collection);

        Instant start = Instant.now();
        try {
            callWithRetry(() -> doDelete(collection, documentId));
            long elapsed = Duration.between(start, Instant.now()).toMillis();
            log.info("Delete completed for document {} (elapsed={}ms)", documentId, elapsed);
        } catch (Exception e) {
            long elapsed = Duration.between(start, Instant.now()).toMillis();
            log.error("Delete failed for document {} after {}ms: {}", documentId, elapsed, e.getMessage());
            throw new VectorStoreException("Failed to delete vectors: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean health() {
        try {
            webClient.get().uri("/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();
            return true;
        } catch (Exception e) {
            log.warn("Qdrant health check failed: {}", e.getMessage());
            return false;
        }
    }


    private void doUpsert(String collection, StoredDocument doc) {
        String pointId = doc.getPointId();
        if (pointId == null || pointId.isBlank()) {
            pointId = UUID.randomUUID().toString();
        } else if (!isUuidOrUint(pointId)) {
            pointId = UUID.nameUUIDFromBytes(pointId.getBytes(java.nio.charset.StandardCharsets.UTF_8)).toString();
        }

        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("document_id", doc.getDocumentId());
        payload.put("chunk_id", doc.getChunkId());
        payload.put("filename", doc.getFilename());
        if (doc.getCourseId() != null) {
            payload.put("course_id", doc.getCourseId());
        }
        payload.put("uploaded_by", doc.getUploadedBy());
        payload.put("document_type", doc.getDocumentType());

        ArrayNode points = objectMapper.createArrayNode();
        ObjectNode point = points.addObject();
        point.put("id", pointId);
        ArrayNode vectorArr = point.putArray("vector");
        for (Float v : doc.getVector()) {
            vectorArr.add(v);
        }
        point.set("payload", payload);

        ObjectNode body = objectMapper.createObjectNode();
        body.set("points", points);

        String response = webClient.put()
                .uri("/collections/{name}/points", collection)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(properties.getTimeout())
                .block();

        log.debug("Upsert response: {}", truncate(response));
    }

    private List<SearchResult> doSearch(String collection, List<Float> embedding, int topK, Long courseId) {
        ObjectNode body = objectMapper.createObjectNode();
        body.put("limit", topK);

        ArrayNode vectorArr = body.putArray("vector");
        for (Float v : embedding) {
            vectorArr.add(v);
        }

        body.put("with_payload", true);

        if (courseId != null) {
            ObjectNode filter = objectMapper.createObjectNode();
            ArrayNode mustArr = filter.putArray("must");
            ObjectNode condition = mustArr.addObject();
            condition.put("key", "course_id");
            ObjectNode match = condition.putObject("match");
            match.put("value", courseId);
            body.set("filter", filter);
        }

        String response = webClient.post()
                .uri("/collections/{name}/points/search", collection)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(properties.getTimeout())
                .block();

        return parseSearchResults(response);
    }

    private void doDelete(String collection, long documentId) {
        ObjectNode filter = objectMapper.createObjectNode();
        ArrayNode mustArr = filter.putArray("must");
        ObjectNode condition = mustArr.addObject();
        condition.put("key", "document_id");
        ObjectNode match = condition.putObject("match");
        match.put("value", documentId);

        ObjectNode body = objectMapper.createObjectNode();
        body.set("filter", filter);

        webClient.post()
                .uri("/collections/{name}/points/delete", collection)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(properties.getTimeout())
                .block();
    }

    private List<SearchResult> parseSearchResults(String json) {
        List<SearchResult> results = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode resultArr = root.get("result");
            if (resultArr == null || !resultArr.isArray()) {
                return results;
            }

            for (JsonNode item : resultArr) {
                double score = item.path("score").asDouble(0.0);
                JsonNode payload = item.get("payload");

                SearchResult.SearchResultBuilder builder = SearchResult.builder()
                        .score(score)
                        .documentId(payload.path("document_id").asLong(0))
                        .chunkId(payload.path("chunk_id").asInt(0))
                        .filename(payload.path("filename").asText(""))
                        .uploadedBy(payload.path("uploaded_by").asLong(0))
                        .documentType(payload.path("document_type").asText(""));

                if (payload.has("course_id") && !payload.path("course_id").isNull()) {
                    builder.courseId(payload.path("course_id").asLong());
                }

                results.add(builder.build());
            }
        } catch (Exception e) {
            log.error("Failed to parse search results: {}", e.getMessage());
        }
        return results;
    }


    private <T> T callWithRetry(SupplierWithException<T> supplier) {
        int retries = 0;
        long backoff = 1000;

        while (true) {
            try {
                return supplier.get();
            } catch (Exception e) {
                retries++;
                if (retries >= MAX_RETRIES) {
                    throw new VectorStoreException("Operation failed after " + MAX_RETRIES + " retries", e);
                }
                log.warn("Attempt {} failed, retrying in {}ms: {}", retries, backoff, e.getMessage());
                try {
                    Thread.sleep(backoff);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new VectorStoreException("Retry interrupted", ie);
                }
                backoff *= 2;
            }
        }
    }

    private void callWithRetry(RunnableWithException runnable) {
        int retries = 0;
        long backoff = 1000;

        while (true) {
            try {
                runnable.run();
                return;
            } catch (Exception e) {
                retries++;
                if (retries >= MAX_RETRIES) {
                    throw new VectorStoreException("Operation failed after " + MAX_RETRIES + " retries", e);
                }
                log.warn("Attempt {} failed, retrying in {}ms: {}", retries, backoff, e.getMessage());
                try {
                    Thread.sleep(backoff);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new VectorStoreException("Retry interrupted", ie);
                }
                backoff *= 2;
            }
        }
    }

    private boolean isUuidOrUint(String id) {
        if (id == null || id.isBlank()) return false;
        if (id.matches("^\\d{1,20}$")) return true;
        try {
            UUID.fromString(id);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private String truncate(String s) {
        return s != null && s.length() > 200 ? s.substring(0, 200) + "..." : s;
    }

    @FunctionalInterface
    private interface SupplierWithException<T> {
        T get() throws Exception;
    }

    @FunctionalInterface
    private interface RunnableWithException {
        void run() throws Exception;
    }
}