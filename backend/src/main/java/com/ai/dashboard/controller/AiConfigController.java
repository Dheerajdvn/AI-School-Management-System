package com.ai.dashboard.controller;

import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.UserAiConfigDto;
import com.ai.dashboard.dto.VerifyConnectionResponseDto;
import com.ai.dashboard.service.UserAiConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST endpoints for per-user AI provider configuration.
 *
 * <p>All endpoints are accessible to authenticated users.  The service
 * delegates to {@link com.ai.dashboard.ai.provider.ProviderRegistry}
 * so that adding a new provider does not require controller changes.</p>
 */
@Slf4j
@RestController
@RequestMapping("/ai/config")
@RequiredArgsConstructor
@Tag(name = "AI Config", description = "Per-user LLM provider configuration")
public class AiConfigController {

    private final UserAiConfigService configService;

    /**
     * Extract the username from the authentication object.
     */
    private String getUsername(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User must be authenticated");
        }
        return authentication.getName();
    }

    @GetMapping
    @Operation(summary = "Get the current user's AI configuration")
    public ApiResponse<UserAiConfigDto> getConfig(Authentication authentication) {
        String username = getUsername(authentication);
        UserAiConfigDto config = configService.getUserConfig(username);
        return ApiResponse.success(config);
    }

    @PostMapping
    @Operation(summary = "Save the current user's AI configuration")
    public ApiResponse<UserAiConfigDto> saveConfig(
            @Valid @RequestBody UserAiConfigDto dto,
            Authentication authentication) {
        String username = getUsername(authentication);
        UserAiConfigDto saved = configService.saveConfig(username, dto);
        return ApiResponse.success("AI configuration saved successfully", saved);
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify connection to the selected provider and list available models")
    public ApiResponse<VerifyConnectionResponseDto> verifyConnection(
            @Valid @RequestBody UserAiConfigDto dto,
            Authentication authentication) {
        String username = getUsername(authentication);
        VerifyConnectionResponseDto result = configService.verifyConnection(username, dto);
        return ApiResponse.success(result);
    }

    @PostMapping("/reset")
    @Operation(summary = "Reset the current user's AI configuration to defaults")
    public ApiResponse<UserAiConfigDto> resetConfig(Authentication authentication) {
        String username = getUsername(authentication);
        UserAiConfigDto reset = configService.resetToDefault(username);
        return ApiResponse.success("AI configuration reset to defaults", reset);
    }

    @GetMapping("/providers")
    @Operation(summary = "List all supported LLM providers")
    public ApiResponse<List<String>> getProviders() {
        List<String> providers = configService.getSupportedProviders();
        return ApiResponse.success(providers);
    }

    @GetMapping("/providers/info")
    @Operation(summary = "Get detailed information about all supported providers")
    public ApiResponse<List<Map<String, Object>>> getProviderInfo() {
        return ApiResponse.success(configService.getSupportedProviders().stream()
                .map(name -> Map.<String, Object>of(
                        "name", name,
                        "apiKeyRequired", !name.equals("Ollama"),
                        "defaultBaseUrl", getDefaultBaseUrl(name)))
                .toList());
    }

    private String getDefaultBaseUrl(String providerName) {
        return switch (providerName) {
            case "Ollama" -> "http://localhost:11434";
            case "OpenAI" -> "https://api.openai.com";
            case "Anthropic" -> "https://api.anthropic.com";
            case "Google Gemini" -> "https://generativelanguage.googleapis.com";
            case "Groq" -> "https://api.groq.com";
            case "OpenRouter" -> "https://openrouter.ai";
            case "Azure OpenAI" -> "https://your-resource.openai.azure.com";
            case "DeepSeek" -> "https://api.deepseek.com";
            case "Mistral AI" -> "https://api.mistral.ai";
            default -> "";
        };
    }
}
