package com.ai.dashboard.ai.model;

import java.util.stream.Stream;

/**
 * Contract for LLM model providers.
 */
public interface LLMProvider {

    /**
     * Generate a completion for the given prompt.
     *
     * @param prompt the prompt to send to the provider
     * @return the generated response
     */
    String generate(String prompt);

    /**
     * Generate a completion with a provider-level system prompt.
     *
     * @param systemPrompt the system instructions
     * @param prompt the prompt to send to the provider
     * @return the generated response
     */
    default String generate(String systemPrompt, String prompt) {
        if (systemPrompt == null || systemPrompt.isBlank()) {
            return generate(prompt);
        }
        return generate(systemPrompt + System.lineSeparator() + System.lineSeparator() + prompt);
    }

    /**
     * Generate a streaming chat response.
     *
     * @param prompt the prompt to stream
     * @return a flux of response chunks
     */
    Stream<String> stream(String prompt);

    /**
     * Check if the provider is available.
     *
     * @return true if the provider is healthy
     */
    boolean isAvailable();

    /**
     * Get the provider name.
     *
     * @return the provider identifier
     */
    String getProviderName();

    /**
     * Backwards-compatible alias for existing call sites.
     */
    default boolean isHealthy() {
        return isAvailable();
    }

    /**
     * Backwards-compatible alias for existing call sites.
     */
    default String getName() {
        return getProviderName();
    }
}
