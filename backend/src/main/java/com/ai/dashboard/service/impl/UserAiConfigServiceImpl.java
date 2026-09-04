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

import java.net.InetAddress;
import java.net.URI;
import java.util.List;
import java.util.Set;

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

    private static final Set<String> BLOCKED_HOSTS = Set.of(
            "169.254.169.254", "metadata.google.internal", "instance-data"
    );

    private final UserAiConfigRepository configRepository;
    private final UserRepository userRepository;
    private final ProviderRegistry providerRegistry;

    @Override
    @Transactional(readOnly = true)
    public UserAiConfigDto getUserConfig(String username) {
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username).orElse(null));

        if (user == null) {
            return defaultConfigDto();
        }

        return configRepository.findByUserId(user.getId())
                .map(this::toDto)
                .orElseGet(this::defaultConfigDto);
    }

    @Override
    public UserAiConfigDto saveConfig(String username, UserAiConfigDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseThrow(() -> new IllegalArgumentException("User not found: " + username)));

        UserAiConfig config = configRepository.findByUserId(user.getId())
                .orElse(UserAiConfig.builder().user(user).build());

        // Validate provider
        providerRegistry.get(dto.getProvider());

        config.setProvider(dto.getProvider());

        // If client submitted masked key or null, retain existing key if present
        String incomingKey = dto.getApiKey();
        if (incomingKey != null && !incomingKey.isBlank() && !incomingKey.contains("...")) {
            config.setApiKey(incomingKey);
        }

        validateBaseUrlSafety(dto.getBaseUrl(), dto.getProvider());
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

        // If client submitted masked key, resolve original key from database
        if (apiKey != null && apiKey.contains("...") && username != null) {
            User user = userRepository.findByUsername(username)
                    .orElseGet(() -> userRepository.findByEmail(username).orElse(null));
            if (user != null) {
                var existingOpt = configRepository.findByUserId(user.getId());
                if (existingOpt.isPresent()) {
                    apiKey = existingOpt.get().getApiKey();
                }
            }
        }

        try {
            validateBaseUrlSafety(baseUrl, dto.getProvider());
        } catch (IllegalArgumentException e) {
            return VerifyConnectionResponseDto.builder()
                    .connected(false)
                    .message("Security check failed: " + e.getMessage())
                    .models(List.of())
                    .build();
        }

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
                if (models == null || models.isEmpty()) {
                    models = getFallbackModelsForProvider(dto.getProvider());
                }
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
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseThrow(() -> new IllegalArgumentException("User not found: " + username)));

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

    private void validateBaseUrlSafety(String baseUrl, String provider) {
        if (baseUrl == null || baseUrl.isBlank()) {
            return;
        }
        try {
            URI uri = URI.create(baseUrl.trim());
            String scheme = uri.getScheme();
            if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                throw new IllegalArgumentException("Invalid URL scheme: only http and https are permitted");
            }
            String host = uri.getHost();
            if (host == null || host.isBlank()) {
                throw new IllegalArgumentException("Invalid host in baseUrl");
            }
            String lowerHost = host.toLowerCase();
            if (BLOCKED_HOSTS.contains(lowerHost)) {
                throw new IllegalArgumentException("Access to cloud metadata endpoints is blocked");
            }

            boolean isLocalOllama = "Ollama".equalsIgnoreCase(provider)
                    && (lowerHost.equals("localhost") || lowerHost.equals("127.0.0.1"));

            if (!isLocalOllama) {
                InetAddress[] addresses = InetAddress.getAllByName(host);
                for (InetAddress addr : addresses) {
                    if (addr.isLoopbackAddress() || addr.isSiteLocalAddress() || addr.isLinkLocalAddress()
                            || addr.isAnyLocalAddress() || addr.isMulticastAddress()) {
                        throw new IllegalArgumentException("Access to private/internal network addresses is blocked");
                    }
                }
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Malformed or unresolvable baseUrl: " + e.getMessage());
        }
    }

    private UserAiConfigDto defaultConfigDto() {
        return UserAiConfigDto.builder()
                .provider("Ollama")
                .baseUrl("http://localhost:11434")
                .model("qwen2.5-coder:3b")
                .temperature(0.2)
                .maxTokens(2048)
                .streamingEnabled(true)
                .aiSuggestionsEnabled(true)
                .isConnected(false)
                .build();
    }

    private UserAiConfigDto toDto(UserAiConfig config) {
        return UserAiConfigDto.builder()
                .id(config.getId())
                .provider(config.getProvider())
                .apiKey(maskApiKey(config.getApiKey()))
                .baseUrl(config.getBaseUrl())
                .model(config.getModel())
                .temperature(config.getTemperature())
                .maxTokens(config.getMaxTokens())
                .streamingEnabled(config.getStreamingEnabled())
                .aiSuggestionsEnabled(config.getAiSuggestionsEnabled())
                .isConnected(config.getConnected())
                .build();
    }

    private String maskApiKey(String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            return null;
        }
        if (apiKey.length() <= 8) {
            return "********";
        }
        return apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length() - 4);
    }

    private List<String> getFallbackModelsForProvider(String provider) {
        if (provider == null) return List.of();
        return switch (provider) {
            case "OpenAI" -> List.of("gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "o1-mini");
            case "Google Gemini" -> List.of("gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.7-flash", "gemini-flash-latest");
            case "Anthropic" -> List.of("claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229");
            case "Groq" -> List.of("llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768");
            case "DeepSeek" -> List.of("deepseek-chat", "deepseek-reasoner");
            case "Mistral AI" -> List.of("mistral-small-latest", "mistral-large-latest", "codestral-latest");
            case "OpenRouter" -> List.of("meta-llama/llama-3.3-70b-instruct", "google/gemini-flash-1.5", "openai/gpt-4o-mini");
            case "Azure OpenAI" -> List.of("gpt-4o-mini", "gpt-4o");
            case "Ollama" -> List.of("qwen2.5-coder:3b", "llama3.2:3b", "mistral:7b");
            default -> List.of();
        };
    }
}

