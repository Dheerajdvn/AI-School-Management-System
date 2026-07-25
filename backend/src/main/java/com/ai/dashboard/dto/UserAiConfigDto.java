package com.ai.dashboard.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAiConfigDto {

    private Long id;

    @NotNull(message = "Provider is required")
    private String provider;

    private String apiKey;
    private String baseUrl;
    private String model;

    @Builder.Default
    private Double temperature = 0.2;

    @Builder.Default
    private Integer maxTokens = 2048;

    @Builder.Default
    private Boolean streamingEnabled = true;

    @Builder.Default
    private Boolean aiSuggestionsEnabled = true;

    private Boolean isConnected;
}
