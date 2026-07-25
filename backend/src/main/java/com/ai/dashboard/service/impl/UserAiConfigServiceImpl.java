package com.ai.dashboard.service.impl;

import com.ai.dashboard.ai.provider.LlmProviderStrategy;
import com.ai.dashboard.ai.provider.ProviderRegistry;
import com.ai.dashboard.dto.UserAiConfigDto;
import com.ai.dashboard.dto.VerifyConnectionResponseDto;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.entity.UserAiConfig;
import com.ai.dashboard.repository.UserAiConfigRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.service.UserAiConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of {@link UserAiConfigService}.
 *
 * <p>Delegates provider-specific operations (model listing, connection
 * verification) to the {@link ProviderRegistry}, keeping this service
 * free of any provider-specific logic.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserAiConfigServiceImpl implements UserAiConfigService {

    private final UserAiConfigRepository configRepository;
    private final UserRepository userRepository;
    private final ProviderRegistry providerRegistry;

    @Override
    @Transactional(readOnly = true)
    public UserAiConfigDto getUserConfig(String username) {
        UserAiConfig config = findOrCreate(username);
        return toDto(config);
    }

    @Override
    public UserAiConfigDto saveConfig(String username, UserAiConfigDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        UserAiConfig config = configRepository.findByUserId(user.getId())
                .orElse(UserAiConfig.builder().user(user).build());

        // Validate provider
        LlmProviderStrategy strategy = providerRegistry.get(dto.getProvider());

        config.setProvider(dto.getProvider());
        config.setApiKey(dto.getApiKey());
        config.setBaseUrl(dto.getBaseUrl());
        config.setModel(dto.getModel());
        config.setTemperature(dto.getTemperature() != null ? dto.getTemperature() : 0.2);
        config.setMaxTokens(dto.getMaxTokens() != null ? dto.getMaxTokens() : 2048);
        config.setStreamingEnabled(dto.getStreamingEnabled() != null ? dto.getStreamingEnabled() : true);
        config.setAiSuggestionsEnabled(dto.getAiSuggestionsEnabled() != null ? dto.getAiSuggestionsEnabled() : true);
        config.setConnected(dto.getIsConnected() != null ? dto.getIsConnected() : false);

        UserAiConfig saved = configRepository.save(config);
        log.info("Saved AI config for user {}: provider={}", username, dto.getProvider());
        return toDto(saved);
    }

    @Override
    public VerifyConnectionResponseDto verifyConnection(String username, UserAiConfigDto dto) {
        // Validate provider
        LlmProviderStrategy strategy = providerRegistry.get(dto.getProvider());

        String apiKey = dto.getApiKey();
        String baseUrl = dto.getBaseUrl();

        // If API key is required but not provided, fail early
        if (strategy.isApiKeyRequired() && (apiKey == null || apiKey.isBlank())) {
            return VerifyConnectionResponseDto.builder()
                    .connected(false)
                    .message("API key is required for provider: " + dto.getProvider())
                    .models(List.of())
                    .build();
        }

        try {
            boolean connected = strategy.verifyConnection(apiKey, baseUrl);

            if (connected) {
                List<String> models = strategy.getModels(apiKey, baseUrl);
                return VerifyConnectionResponseDto.builder()
                        .connected(true)
                        .message("Connection verified successfully")
                        .models(models)
                        .build();
            } else {
                return VerifyConnectionResponseDto.builder()
                        .connected(false)
                        .message("Failed to connect to " + dto.getProvider() +
                                (baseUrl != null && !baseUrl.isBlank() ? " at " + baseUrl : ""))
                        .models(List.of())
                        .build();
            }
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            log.warn("{} verifyConnection failed: {} - {}", dto.getProvider(), e.getStatusCode(), e.getResponseBodyAsString());
            return VerifyConnectionResponseDto.builder()
                    .connected(false)
                    .message("Connection failed (" + e.getStatusCode().value() + "): " + e.getResponseBodyAsString())
                    .models(List.of())
                    .build();
        } catch (Exception e) {
            log.warn("{} verifyConnection error: {}", dto.getProvider(), e.getMessage());
            return VerifyConnectionResponseDto.builder()
                    .connected(false)
                    .message("Connection error: " + e.getMessage())
                    .models(List.of())
                    .build();
        }
    }

    @Override
    public UserAiConfigDto resetToDefault(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        UserAiConfig config = configRepository.findByUserId(user.getId())
                .orElse(UserAiConfig.builder().user(user).build());

        config.setProvider("Ollama");
        config.setApiKey(null);
        config.setBaseUrl("http://localhost:11434");
        config.setModel("qwen2.5-coder:3b");
        config.setTemperature(0.2);
        config.setMaxTokens(2048);
        config.setStreamingEnabled(true);
        config.setAiSuggestionsEnabled(true);
        config.setConnected(false);

        UserAiConfig saved = configRepository.save(config);
        log.info("Reset AI config to defaults for user {}", username);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getSupportedProviders() {
        return providerRegistry.getSupportedProviders();
    }

    // ------------------------------------------------------------------

    private UserAiConfig findOrCreate(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return configRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserAiConfig config = UserAiConfig.builder()
                            .user(user)
                            .provider("Ollama")
                            .baseUrl("http://localhost:11434")
                            .model("qwen2.5-coder:3b")
                            .temperature(0.2)
                            .maxTokens(2048)
                            .streamingEnabled(true)
                            .aiSuggestionsEnabled(true)
                            .connected(false)
                            .build();
                    return configRepository.save(config);
                });
    }

    private UserAiConfigDto toDto(UserAiConfig config) {
        return UserAiConfigDto.builder()
                .id(config.getId())
                .provider(config.getProvider())
                .apiKey(config.getApiKey())
                .baseUrl(config.getBaseUrl())
                .model(config.getModel())
                .temperature(config.getTemperature())
                .maxTokens(config.getMaxTokens())
                .streamingEnabled(config.getStreamingEnabled())
                .aiSuggestionsEnabled(config.getAiSuggestionsEnabled())
                .isConnected(config.getConnected())
                .build();
    }
}
