package com.ai.dashboard.ai.provider.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.stream.Stream;

/**
 * Google Gemini provider strategy.
 *
 * <p>Models are listed via {@code GET /v1/models} and generation via
 * {@code POST /v1/models/{model}:generateContent?key=...}.</p>
 */
@Slf4j
@Component
public class GoogleGeminiStrategy extends AbstractLlmProviderStrategy {

    public GoogleGeminiStrategy(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public String getProviderName() {
        return "Google Gemini";
    }

    @Override
    public String getDefaultBaseUrl() {
        return "https://generativelanguage.googleapis.com";
    }

    @Override
    public boolean isApiKeyRequired() {
        return true;
    }

    @Override
    protected String getModelsPath() {
        return "/v1beta/models";
    }

    @Override
    protected org.springframework.http.HttpHeaders buildHeaders(String apiKey) {
        // Google Gemini does not use Bearer auth header; auth is passed via query param ?key=...
        return new org.springframework.http.HttpHeaders();
    }

    @Override
    public List<String> getModels(String apiKey, String baseUrl) {
        try {
            WebClient client = buildClient(apiKey, baseUrl);
            String uri = getModelsPath() + "?key=" + (apiKey != null ? apiKey : "");
            String response = client.get()
                    .uri(uri)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (response == null || response.isBlank()) {
                return List.of();
            }

            JsonNode root = objectMapper.readTree(response);
            List<String> models = extractModelIds(root);
            return models.stream()
                    .map(m -> m.startsWith("models/") ? m.substring(7) : m)
                    .toList();
        } catch (Exception e) {
            log.warn("Google Gemini getModels error: {}", e.getMessage());
            return List.of();
        }
    }

    @Override
    public boolean verifyConnection(String apiKey, String baseUrl) {
        WebClient client = buildClient(apiKey, baseUrl);
        String uri = getModelsPath() + "?key=" + (apiKey != null ? apiKey : "");
        client.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(15))
                .block();
        return true;
    }

    @Override
    public String generate(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String systemPrompt, String prompt) {
        WebClient client = buildClient(apiKey, baseUrl);
        String modelName = model != null ? model : "gemini-1.5-flash";
        String uri = "/v1/models/" + modelName + ":generateContent?key=" + (apiKey != null ? apiKey : "");

        ObjectNode body = objectMapper.createObjectNode();
        body.putArray("contents").add(objectMapper.createObjectNode()
                .put("role", "user")
                .put("parts", objectMapper.createArrayNode()
                        .add(objectMapper.createObjectNode().put("text", prompt))));
        body.putObject("generationConfig")
                .put("temperature", temperature != null ? temperature : 0.2)
                .put("maxOutputTokens", maxTokens != null ? maxTokens : 2048);

        try {
            String response = client.post()
                    .uri(uri)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();
            return extractResponseField(response, "candidates", 0, "content", "parts", 0, "text");
        } catch (Exception e) {
            log.error("Google Gemini generate failed: {}", e.getMessage());
            throw new RuntimeException("Failed to generate response from Google Gemini: " + e.getMessage(), e);
        }
    }

    @Override
    public Stream<String> stream(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String prompt) {
        return Stream.of(generate(apiKey, baseUrl, model, temperature, maxTokens, null, prompt));
    }

    private String extractResponseField(String json, Object... path) {
        try {
            JsonNode node = objectMapper.readTree(json);
            for (Object p : path) {
                if (p instanceof Integer && node.isArray()) {
                    node = node.get((Integer) p);
                } else if (p instanceof String) {
                    node = node.path((String) p);
                }
                if (node == null || node.isMissingNode()) return "";
            }
            return node.asText("");
        } catch (Exception e) {
            return "";
        }
    }
}
