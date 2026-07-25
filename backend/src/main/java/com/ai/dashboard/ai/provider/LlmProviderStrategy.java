package com.ai.dashboard.ai.provider;

import java.util.List;
import java.util.stream.Stream;

/**
 * Provider abstraction strategy interface for supported LLM services.
 */
public interface LlmProviderStrategy {

    /**
     * Unique name identifying the provider (e.g. "Ollama", "OpenAI", "Anthropic", etc.)
     */
    String getProviderName();

    /**
     * Default base URL for this provider.
     */
    String getDefaultBaseUrl();

    /**
     * Whether API key is required for this provider (false for Ollama, true for others).
     */
    boolean isApiKeyRequired();

    /**
     * Retrieve available models dynamically from the provider API or fallback list.
     */
    List<String> getModels(String apiKey, String baseUrl);

    /**
     * Verify connectivity to the provider endpoint using the given credentials and base URL.
     */
    boolean verifyConnection(String apiKey, String baseUrl);

    /**
     * Generate text output for a system prompt + prompt combination.
     */
    String generate(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String systemPrompt, String prompt);

    /**
     * Generate text output stream.
     */
    Stream<String> stream(String apiKey, String baseUrl, String model, Double temperature, Integer maxTokens, String prompt);
}
