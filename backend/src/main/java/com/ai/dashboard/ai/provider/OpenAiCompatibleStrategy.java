package com.ai.dashboard.ai.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.*;
import java.util.stream.Stream;

@Slf4j
public abstract class OpenAiCompatibleStrategy implements LlmProviderStrategy {

    protected final ObjectMapper objectMapper = new ObjectMapper();

    protected String getEffectiveBaseUrl(String baseUrl) {
        if (baseUrl != null && !baseUrl.isBlank()) {
            String trimmed = baseUrl.trim();
            return trimmed.endsWith("/") ? trimmed.substring(0, trimmed.length() - 1) : trimmed;
        }
        return getDefaultBaseUrl();
    }

    @Override
    public boolean isApiKeyRequired() {
        return true;
    }

    @Override
    public List<String> getModels(String apiKey, String baseUrl) {
        String url = getEffectiveBaseUrl(baseUrl);
        try {
            WebClient client = WebClient.builder()
                    .baseUrl(url)
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + (apiKey != null ? apiKey : ""))
                    .build();

            String response = client.get()
                    .uri("/models")
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(8))
                    .block();

            if (response != null) {
                JsonNode root = objectMapper.readTree(response);
                JsonNode dataNode = root.get("data");
                if (dataNode != null && dataNode.isArray()) {
                    List<String> models = new ArrayList<>();
                    for (JsonNode modelNode : dataNode) {
                        if (modelNode.has("id")) {
                            models.add(modelNode.get("id").asText());
                        }
                    }
                    if (!models.isEmpty()) {
                        Collections.sort(models);
                        return models;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to dynamically fetch models from {}: {}", getProviderName(), e.getMessage());
        }
        return getDefaultModels();
    }

    @Override
    public boolean verifyConnection(String apiKey, String baseUrl) {
        String url = getEffectiveBaseUrl(baseUrl);
        try {
            WebClient client = WebClient.builder()
                    .baseUrl(url)
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + (apiKey != null ? apiKey : ""))
                    .build();

            String response = client.get()
                    .uri("/models")
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(8))
                    .block();

            return response != null && !response.isBlank();
        } catch (Exception e) {
            log.warn("Connection verification failed for {}: {}", getProviderName(), e.getMessage());
            return false;
        }
    }

    @Override
    public String generate(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String systemPrompt, String prompt) {
        String url = getEffectiveBaseUrl(baseUrl);
        WebClient client = WebClient.builder()
                .baseUrl(url)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + (apiKey != null ? apiKey : ""))
                .build();

        List<Map<String, String>> messages = new ArrayList<>();
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            messages.add(Map.of("role", "system", "content", systemPrompt));
        }
        messages.add(Map.of("role", "user", "content", prompt));

        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("model", model != null && !model.isBlank() ? model : getDefaultModels().get(0));
        requestBody.put("messages", messages);
        requestBody.put("temperature", temperature != null ? temperature : 0.2);
        if (maxTokens != null && maxTokens > 0) {
            requestBody.put("max_tokens", maxTokens);
        }

        try {
            String response = client.post()
                    .uri("/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();

            if (response != null) {
                JsonNode root = objectMapper.readTree(response);
                JsonNode choices = root.get("choices");
                if (choices != null && choices.isArray() && choices.size() > 0) {
                    JsonNode messageNode = choices.get(0).get("message");
                    if (messageNode != null && messageNode.has("content")) {
                        return messageNode.get("content").asText();
                    }
                }
            }
        } catch (Exception e) {
            log.error("{} chat completion failed: {}", getProviderName(), e.getMessage(), e);
            throw new RuntimeException(getProviderName() + " completion failed: " + e.getMessage(), e);
        }
        return "";
    }

    @Override
    public Stream<String> stream(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String prompt) {
        String result = generate(apiKey, baseUrl, model, temperature, maxTokens, null, prompt);
        return Stream.of(result);
    }

    protected abstract List<String> getDefaultModels();
}