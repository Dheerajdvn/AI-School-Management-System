package com.ai.dashboard.ai.model;

import com.ai.dashboard.ai.exception.AIException;
import com.ai.dashboard.config.OllamaProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;


import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Ollama-based implementation of LLMProvider.
 */
@Slf4j
@Component
public class OllamaProvider implements LLMProvider {

    private static final String GENERATE_PATH = "/api/generate";
    private static final String HEALTH_PATH = "/api/tags";

    private final WebClient webClient;
    private final OllamaProperties props;
    private final ObjectMapper objectMapper;

    public OllamaProvider(
            @Qualifier("ollamaWebClient") WebClient webClient,
            OllamaProperties props,
            ObjectMapper objectMapper) {
        this.webClient = webClient;
        this.props = props;
        this.objectMapper = objectMapper;
    }

    @Override
    public String generate(String prompt) {
        return generate(null, prompt);
    }

    @Override
    public String generate(String systemPrompt, String prompt) {
        int attempts = 0;
        while (attempts < props.getMaxRetries()) {
            try {
                return callOllama(systemPrompt, prompt);
            } catch (AIException e) {
                if (e.getErrorType() == AIException.ErrorType.MODEL_UNAVAILABLE
                        || e.getErrorType() == AIException.ErrorType.CONNECTION_REFUSED) {
                    attempts++;
                    log.warn("Ollama call attempt {} failed: {}", attempts, e.getMessage());
                    if (attempts >= props.getMaxRetries()) {
                        throw new AIException(
                                AIException.ErrorType.MODEL_UNAVAILABLE,
                                "Failed to get response from Ollama after " + attempts + " attempts");
                    }
                } else {
                    throw e;
                }
            }
        }
        throw new AIException(AIException.ErrorType.UNKNOWN, "Unexpected error in Ollama provider");
    }

    @Override
    public Stream<String> stream(String prompt) {
        return Stream.of(generate(prompt));
    }

    @Override
    public boolean isAvailable() {
        try {
            webClient.get().uri(HEALTH_PATH)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();
            return true;
        } catch (Exception e) {
            log.warn("Ollama health check failed: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public String getProviderName() {
        return "ollama-" + props.getModel();
    }

    private String callOllama(String systemPrompt, String prompt) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", props.getModel());
        body.put("prompt", prompt);
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            body.put("system", systemPrompt);
        }
        body.put("stream", false);
        body.put("options", Map.of(
                "temperature", props.getTemperature(),
                "num_predict", props.getMaxTokens()
        ));

        log.debug("Calling Ollama model={} (prompt length={})", props.getModel(), prompt.length());

        try {
            String response = webClient.post()
                    .uri(GENERATE_PATH)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(props.getTimeout()))
                    .block();

            if (response == null || response.isBlank()) {
                throw new AIException(
                        AIException.ErrorType.INVALID_REQUEST,
                        "Empty response from Ollama");
            }

            return extractResponse(response);
        } catch (WebClientResponseException e) {
            log.error("Ollama API error: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new AIException(
                    AIException.ErrorType.MODEL_UNAVAILABLE,
                    "Ollama returned error: " + e.getStatusCode());
        } catch (WebClientRequestException e) {
            log.error("Ollama connection error: {}", e.getMessage());
            throw new AIException(
                    AIException.ErrorType.CONNECTION_REFUSED,
                    "Cannot connect to Ollama");
        } catch (AIException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error calling Ollama", e);
            throw new AIException(
                    AIException.ErrorType.UNKNOWN,
                    "Failed to call Ollama: " + e.getMessage());
        }
    }

    private String extractResponse(String json) {
        try {
            JsonNode node = objectMapper.readTree(json);
            if (node.has("response")) {
                return node.get("response").asText("");
            }
            if (node.isArray() && node.size() > 0) {
                return node.get(node.size() - 1).path("response").asText("");
            }
            return node.path("message").path("content").asText("");
        } catch (Exception e) {
            log.error("Failed to parse Ollama response: {}", e.getMessage());
            throw new AIException(
                    AIException.ErrorType.INVALID_REQUEST,
                    "Malformed Ollama response");
        }
    }
}
