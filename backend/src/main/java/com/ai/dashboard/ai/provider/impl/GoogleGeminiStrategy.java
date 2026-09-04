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
            List<String> models = new java.util.ArrayList<>();
            if (root.has("models") && root.get("models").isArray()) {
                for (JsonNode node : root.get("models")) {
                    boolean supportsGenerate = false;
                    if (node.has("supportedGenerationMethods") && node.get("supportedGenerationMethods").isArray()) {
                        for (JsonNode m : node.get("supportedGenerationMethods")) {
                            if ("generateContent".equalsIgnoreCase(m.asText())) {
                                supportsGenerate = true;
                                break;
                            }
                        }
                    } else {
                        supportsGenerate = true;
                    }

                    if (supportsGenerate) {
                        String name = node.has("name") ? node.get("name").asText() : "";
                        if (name.startsWith("models/")) {
                            name = name.substring(7);
                        }
                        if (!name.isBlank()) {
                            models.add(name);
                        }
                    }
                }
            }
            return models.isEmpty() ? List.of("gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.7-flash", "gemini-flash-latest") : models;
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
        String modelName = (model != null && !model.isBlank()) ? model.trim() : "gemini-3.6-flash";
        if (modelName.startsWith("models/")) {
            modelName = modelName.substring(7);
        }
        String uri = "/v1beta/models/" + modelName + ":generateContent?key=" + (apiKey != null ? apiKey : "");

        ObjectNode body = objectMapper.createObjectNode();
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            body.putObject("system_instruction")
                    .putArray("parts")
                    .addObject()
                    .put("text", systemPrompt);
        }

        com.fasterxml.jackson.databind.node.ArrayNode contents = body.putArray("contents");
        ObjectNode userMessage = contents.addObject();
        userMessage.put("role", "user");
        userMessage.putArray("parts")
                .addObject()
                .put("text", prompt);

        body.putObject("generationConfig")
                .put("temperature", temperature != null ? temperature : 0.2)
                .put("maxOutputTokens", maxTokens != null ? maxTokens : 2048);

        int maxAttempts = 4;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                String response = client.post()
                        .uri(uri)
                        .bodyValue(body)
                        .retrieve()
                        .bodyToMono(String.class)
                        .timeout(Duration.ofSeconds(120))
                        .block();
                String text = extractResponseField(response, "candidates", 0, "content", "parts", 0, "text");
                if (text == null || text.isBlank()) {
                    JsonNode root = objectMapper.readTree(response);
                    if (root.has("error")) {
                        String errorMsg = root.path("error").path("message").asText("Unknown error from Google Gemini");
                        throw new RuntimeException(errorMsg);
                    }
                }
                return text;
            } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
                String errorBody = e.getResponseBodyAsString();
                if (e.getStatusCode().value() == 429 && attempt < maxAttempts) {
                    long backoffMs = attempt * 2000L;
                    try {
                        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("(\"retryDelay\"\\s*:\\s*\"|retry in\\s*)([0-9.]+)(s|ms)", java.util.regex.Pattern.CASE_INSENSITIVE).matcher(errorBody);
                        if (matcher.find()) {
                            double delay = Double.parseDouble(matcher.group(2));
                            if ("s".equalsIgnoreCase(matcher.group(3))) {
                                if (delay <= 35.0) {
                                    backoffMs = (long) ((delay + 1.0) * 1000);
                                }
                            } else {
                                backoffMs = (long) (delay + 500);
                            }
                        }
                    } catch (Exception ignored) {}

                    log.warn("Gemini 429 rate limit encountered on attempt {}/{}, backing off for {}ms...", attempt, maxAttempts, backoffMs);
                    try {
                        Thread.sleep(backoffMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Gemini request interrupted during backoff", ie);
                    }
                    continue;
                }
                log.error("Google Gemini generate failed: {} - {}", e.getStatusCode(), errorBody);
                String message = errorBody;
                try {
                    JsonNode errNode = objectMapper.readTree(errorBody);
                    if (errNode.has("error") && errNode.get("error").has("message")) {
                        message = errNode.get("error").get("message").asText();
                    }
                } catch (Exception ignored) {}
                if (e.getStatusCode().value() == 429) {
                    throw new RuntimeException("Google Gemini rate limit reached (Free tier limit: 20 requests/minute). Please wait 30 seconds before asking your next question.", e);
                }
                throw new RuntimeException("Failed to generate response from Google Gemini (" + e.getStatusCode().value() + "): " + message, e);
            } catch (Exception e) {
                log.error("Google Gemini generate failed: {}", e.getMessage());
                throw new RuntimeException("Failed to generate response from Google Gemini: " + e.getMessage(), e);
            }
        }
        throw new RuntimeException("Failed to generate response from Google Gemini after retries");
    }

    @Override
    public Stream<String> stream(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String prompt) {
        String full = generate(apiKey, baseUrl, model, temperature, maxTokens, null, prompt);
        if (full == null || full.isBlank()) {
            return Stream.empty();
        }
        String[] words = full.split("(?<=\\s)|(?=\\n)");
        return java.util.Arrays.stream(words);
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
