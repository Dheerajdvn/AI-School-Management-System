package com.ai.dashboard.ai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configuration properties for AI model providers.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "ai")
public class AiProperties {

    private Provider ollama = new Provider();
    private Provider openai = new Provider();
    private int maxRetries = 3;
    private Duration timeout = Duration.ofSeconds(120);
    private boolean promptValidationEnabled = true;

    @Data
    public static class Provider {
        private String baseUrl;
        private String apiKey;
        private String model;
        private double temperature = 0.7;
        private int maxTokens = 2048;
        private boolean enabled = true;
    }
}