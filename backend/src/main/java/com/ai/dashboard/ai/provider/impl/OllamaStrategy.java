package com.ai.dashboard.ai.provider.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.stream.Stream;

/**
 * Ollama provider strategy.
 *
 * <p>Ollama runs locally and does not require an API key.  Models are listed
 * via {@code GET /api/tags} and generation via {@code POST /api/generate}.</p>
 */
@Slf4j
@Component
public class OllamaStrategy extends AbstractLlmProviderStrategy {

    public OllamaStrategy(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public String getProviderName() {
        return "Ollama";
    }

    @Override
    public String getDefaultBaseUrl() {
        return "http://localhost:11434";
    }

    @Override
    public boolean isApiKeyRequired() {
        return false;
    }

    @Override
    protected String getModelsPath() {
        return "/api/tags";
    }

    @Override
    protected HttpHeaders buildHeaders(String apiKey) {
        // Ollama does not use auth headers
        return new HttpHeaders();
    }

    @Override
    public String generate(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String systemPrompt, String prompt) {
        WebClient client = buildClient(apiKey, baseUrl);
        ObjectNode body = objectMapper.createObjectNode()
                .put("model", model)
                .put("prompt", prompt)
                .put("stream", false);
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            body.put("system", systemPrompt);
        }
        body.putObject("options")
                .put("temperature", temperature != null ? temperature : 0.2)
                .put("num_predict", maxTokens != null ? maxTokens : 2048);

        try {
            String response = client.post()
                    .uri("/api/generate")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();
            return extractResponseField(response, "response");
        } catch (Exception e) {
            log.error("Ollama generate failed: {}", e.getMessage());
            throw new RuntimeException("Failed to generate response from Ollama: " + e.getMessage(), e);
        }
    }

    @Override
    public Stream<String> stream(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String prompt) {
        // Ollama streaming would require SSE parsing; for now return single chunk
        return Stream.of(generate(apiKey, baseUrl, model, temperature, maxTokens, null, prompt));
    }

    private String extractResponseField(String json, String field) {
        try {
            return objectMapper.readTree(json).path(field).asText("");
        } catch (Exception e) {
            return "";
        }
    }
}
