package com.ai.dashboard.ai.provider.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.stream.Stream;

/**
 * Groq provider strategy.
 *
 * <p>Groq uses an OpenAI-compatible API.  Models are listed via
 * {@code GET /openai/v1/models} and chat completions via
 * {@code POST /openai/v1/chat/completions}.</p>
 */
@Slf4j
@Component
public class GroqStrategy extends AbstractLlmProviderStrategy {

    public GroqStrategy(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public String getProviderName() {
        return "Groq";
    }

    @Override
    public String getDefaultBaseUrl() {
        return "https://api.groq.com";
    }

    @Override
    public boolean isApiKeyRequired() {
        return true;
    }

    @Override
    protected String getModelsPath() {
        return "/openai/v1/models";
    }

    @Override
    public String generate(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String systemPrompt, String prompt) {
        WebClient client = buildClient(apiKey, baseUrl);
        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", model);
        ArrayNode messages = body.putArray("messages");
        messages.add(objectMapper.createObjectNode()
                .put("role", "system")
                .put("content", systemPrompt != null ? systemPrompt : ""));
        messages.add(objectMapper.createObjectNode()
                .put("role", "user")
                .put("content", prompt));
        body.put("temperature", temperature != null ? temperature : 0.2);
        body.put("max_tokens", maxTokens != null ? maxTokens : 2048);

        try {
            String response = client.post()
                    .uri("/openai/v1/chat/completions")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();
            return extractResponseField(response, "choices", 0, "message", "content");
        } catch (Exception e) {
            log.error("Groq generate failed: {}", e.getMessage());
            throw new RuntimeException("Failed to generate response from Groq: " + e.getMessage(), e);
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
