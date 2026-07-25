package com.ai.dashboard.ai.provider.impl;

import com.ai.dashboard.ai.provider.LlmProviderStrategy;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * Shared base for all {@link LlmProviderStrategy} implementations.
 *
 * <p>Provides a lazily-built {@link WebClient} per (apiKey, baseUrl) pair so that
 * each provider can make authenticated HTTP calls to list models and verify
 * connectivity without duplicating boilerplate.</p>
 */
@Slf4j
public abstract class AbstractLlmProviderStrategy implements LlmProviderStrategy {

    protected final ObjectMapper objectMapper;

    protected AbstractLlmProviderStrategy(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Build a {@link WebClient} for the given credentials and base URL.
     * Subclasses override {@link #buildHeaders} if they need custom auth headers.
     */
    protected WebClient buildClient(String apiKey, String baseUrl) {
        String effectiveBaseUrl = (baseUrl != null && !baseUrl.isBlank()) ? baseUrl : getDefaultBaseUrl();

        HttpClient httpClient = HttpClient.create(ConnectionProvider.builder("ai-provider")
                .maxConnections(10)
                .pendingAcquireMaxCount(20)
                .build())
                .option(io.netty.channel.ChannelOption.CONNECT_TIMEOUT_MILLIS, 10_000)
                .responseTimeout(Duration.ofSeconds(30));

        WebClient.Builder builder = WebClient.builder()
                .baseUrl(effectiveBaseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .clientConnector(new org.springframework.http.client.reactive.ReactorClientHttpConnector(httpClient));

        HttpHeaders headers = buildHeaders(apiKey);
        if (headers != null) {
            headers.forEach((name, values) ->
                    values.forEach(value -> builder.defaultHeader(name, value)));
        }

        return builder.build();
    }

    /**
     * Subclasses provide provider-specific auth headers (e.g. Bearer token,
     * special header names).  Returns {@code null} if no custom headers are needed.
     */
    protected HttpHeaders buildHeaders(String apiKey) {
        HttpHeaders headers = new HttpHeaders();
        if (apiKey != null && !apiKey.isBlank()) {
            headers.setBearerAuth(apiKey);
        }
        return headers;
    }

    /**
     * Extract model IDs from a JSON response node.  Subclasses override this
     * to handle provider-specific response shapes.
     */
    protected List<String> extractModelIds(JsonNode root) {
        List<String> models = new ArrayList<>();
        if (root == null) return models;

        // OpenAI-style: { "data": [ { "id": "gpt-4", ... }, ... ] }
        if (root.has("data") && root.get("data").isArray()) {
            for (JsonNode node : root.get("data")) {
                if (node.has("id")) {
                    models.add(node.get("id").asText());
                }
            }
            if (!models.isEmpty()) return models;
        }

        // Ollama / Google-style: { "models": [ { "name": "...", "id": "..." }, ... ] }
        if (root.has("models") && root.get("models").isArray()) {
            for (JsonNode node : root.get("models")) {
                if (node.has("name")) {
                    models.add(node.get("name").asText());
                } else if (node.has("id")) {
                    models.add(node.get("id").asText());
                } else if (node.has("model")) {
                    models.add(node.get("model").asText());
                }
            }
            if (!models.isEmpty()) return models;
        }

        // Azure-style: { "value": [ { "model": "gpt-4", ... }, ... ] }
        if (root.has("value") && root.get("value").isArray()) {
            for (JsonNode node : root.get("value")) {
                if (node.has("model")) {
                    models.add(node.get("model").asText());
                } else if (node.has("id")) {
                    models.add(node.get("id").asText());
                }
            }
        }

        return models;
    }

    /**
     * Default model-listing implementation: GET the models endpoint and parse
     * the response with {@link #extractModelIds}.  Subclasses can override
     * {@link #getModelsPath()} to customise the path.
     */
    @Override
    public List<String> getModels(String apiKey, String baseUrl) {
        try {
            WebClient client = buildClient(apiKey, baseUrl);
            String response = client.get()
                    .uri(getModelsPath())
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (response == null || response.isBlank()) {
                return List.of();
            }

            JsonNode root = objectMapper.readTree(response);
            return extractModelIds(root);
        } catch (WebClientResponseException e) {
            log.warn("{} getModels failed: {} {}", getProviderName(), e.getStatusCode(), e.getResponseBodyAsString());
            return List.of();
        } catch (Exception e) {
            log.warn("{} getModels error: {}", getProviderName(), e.getMessage());
            return List.of();
        }
    }

    /**
     * Default verification: attempt to list models.  If the call succeeds
     * (even with an empty list) the connection is considered valid.
     */
    @Override
    public boolean verifyConnection(String apiKey, String baseUrl) {
        try {
            WebClient client = buildClient(apiKey, baseUrl);
            client.get()
                    .uri(getModelsPath())
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();
            return true;
        } catch (WebClientResponseException e) {
            log.warn("{} verifyConnection failed: {} {}", getProviderName(), e.getStatusCode(), e.getResponseBodyAsString());
            return false;
        } catch (Exception e) {
            log.warn("{} verifyConnection error: {}", getProviderName(), e.getMessage());
            return false;
        }
    }

    /**
     * Path used to list models.  Defaults to {@code /v1/models}.
     */
    protected String getModelsPath() {
        return "/v1/models";
    }
}
