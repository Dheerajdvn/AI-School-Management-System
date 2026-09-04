package com.ai.dashboard.ai.provider.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.stream.Stream;

/**
 * Azure OpenAI provider strategy.
 *
 * <p>Azure OpenAI uses a deployment-based URL structure.  Models (deployments)
 * are listed via {@code GET /openai/deployments?api-version=...} and chat
 * completions via {@code POST /openai/deployments/{deployment}/chat/completions?api-version=...}.
 *
 * <p>The API key is sent via the {@code api-key} header rather than Bearer auth.</p>
 */
@Slf4j
@Component
public class AzureOpenAIStrategy extends AbstractLlmProviderStrategy {

    private static final String API_VERSION = "2024-02-15-preview";

    public AzureOpenAIStrategy(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public String getProviderName() {
        return "Azure OpenAI";
    }

    @Override
    public String getDefaultBaseUrl() {
        return "https://your-resource.openai.azure.com";
    }

    @Override
    public boolean isApiKeyRequired() {
        return true;
    }

    @Override
    protected String getModelsPath() {
        return "/openai/deployments?api-version=" + API_VERSION;
    }

    @Override
    protected HttpHeaders buildHeaders(String apiKey) {
        HttpHeaders headers = new HttpHeaders();
        if (apiKey != null && !apiKey.isBlank()) {
            headers.set("api-key", apiKey);
        }
        return headers;
    }

    @Override
    public String generate(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String systemPrompt, String prompt) {
        WebClient client = buildClient(apiKey, baseUrl);
        String deployment = (model != null && !model.isBlank()) ? model.trim() : "gpt-4o-mini";
        String uri = "/openai/deployments/" + deployment + "/chat/completions?api-version=" + API_VERSION;

        ObjectNode body = objectMapper.createObjectNode();
        ArrayNode messages = body.putArray("messages");
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            messages.add(objectMapper.createObjectNode()
                    .put("role", "system")
                    .put("content", systemPrompt));
        }
        messages.add(objectMapper.createObjectNode()
                .put("role", "user")
                .put("content", prompt));
        body.put("temperature", temperature != null ? temperature : 0.2);
        body.put("max_tokens", maxTokens != null ? maxTokens : 2048);

        try {
            String response = client.post()
                    .uri(uri)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();
            String text = extractResponseField(response, "choices", 0, "message", "content");
            if (text == null || text.isBlank()) {
                JsonNode root = objectMapper.readTree(response);
                if (root.has("error")) {
                    String errorMsg = root.path("error").path("message").asText("Unknown error from Azure OpenAI");
                    throw new RuntimeException(errorMsg);
                }
            }
            return text;
        } catch (Exception e) {
            log.error("Azure OpenAI generate failed: {}", e.getMessage());
            throw new RuntimeException("Failed to generate response from Azure OpenAI: " + e.getMessage(), e);
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
