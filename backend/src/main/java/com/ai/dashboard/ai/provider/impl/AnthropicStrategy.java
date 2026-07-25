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
 * Anthropic (Claude) provider strategy.
 *
 * <p>Models are listed via {@code GET /v1/models} and messages via
 * {@code POST /v1/messages}.</p>
 */
@Slf4j
@Component
public class AnthropicStrategy extends AbstractLlmProviderStrategy {

    public AnthropicStrategy(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public String getProviderName() {
        return "Anthropic";
    }

    @Override
    public String getDefaultBaseUrl() {
        return "https://api.anthropic.com";
    }

    @Override
    public boolean isApiKeyRequired() {
        return true;
    }

    @Override
    public String generate(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String systemPrompt, String prompt) {
        WebClient client = buildClient(apiKey, baseUrl);
        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", model);
        ArrayNode messages = body.putArray("messages");
        messages.add(objectMapper.createObjectNode()
                .put("role", "user")
                .put("content", prompt));
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            body.put("system", systemPrompt);
        }
        body.put("temperature", temperature != null ? temperature : 0.2);
        body.put("max_tokens", maxTokens != null ? maxTokens : 2048);

        try {
            String response = client.post()
                    .uri("/v1/messages")
                    .header("anthropic-version", "2023-06-01")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();
            return extractResponseField(response, "content", 0, "text");
        } catch (Exception e) {
            log.error("Anthropic generate failed: {}", e.getMessage());
            throw new RuntimeException("Failed to generate response from Anthropic: " + e.getMessage(), e);
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
