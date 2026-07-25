package com.ai.dashboard.service;

import com.ai.dashboard.dto.UserAiConfigDto;
import com.ai.dashboard.dto.VerifyConnectionResponseDto;

import java.util.List;

/**
 * Service contract for managing per-user AI provider configuration.
 *
 * <p>Each user can store their own LLM provider, API key, base URL, model,
 * and generation parameters.  The service delegates to
 * {@link com.ai.dashboard.ai.provider.ProviderRegistry} so that switching
 * providers does not require changes to business logic.</p>
 */
public interface UserAiConfigService {

    /**
     * Retrieve the current user's AI configuration, or a default config
     * if none has been saved yet.
     *
     * @param username the authenticated user's username
     * @return the user's AI configuration DTO
     */
    UserAiConfigDto getUserConfig(String username);

    /**
     * Save (or update) the user's AI configuration.
     *
     * @param username the authenticated user's username
     * @param dto      the configuration to persist
     * @return the saved configuration
     */
    UserAiConfigDto saveConfig(String username, UserAiConfigDto dto);

    /**
     * Verify connectivity to the selected provider and, on success,
     * retrieve the list of available models.
     *
     * @param username the authenticated user's username
     * @param dto      the configuration to verify (provider, apiKey, baseUrl)
     * @return verification result including connection status and model list
     */
    VerifyConnectionResponseDto verifyConnection(String username, UserAiConfigDto dto);

    /**
     * Reset the user's AI configuration to system defaults.
     *
     * @param username the authenticated user's username
     * @return the default configuration
     */
    UserAiConfigDto resetToDefault(String username);

    /**
     * @return list of all supported provider names.
     */
    List<String> getSupportedProviders();
}
