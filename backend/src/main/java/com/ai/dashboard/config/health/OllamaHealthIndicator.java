package com.ai.dashboard.config.health;

import com.ai.dashboard.config.OllamaProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Health indicator for Ollama LLM service connectivity.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OllamaHealthIndicator implements HealthIndicator {

    private final OllamaProperties properties;

    @Override
    public Health health() {
        try {
            URL url = new URL(properties.getBaseUrl() + "/api/tags");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            
            int responseCode = connection.getResponseCode();
            connection.disconnect();
            
            if (responseCode == 200) {
                log.debug("Ollama health check: UP");
                return Health.up()
                        .withDetail("component", "ollama")
                        .withDetail("baseUrl", properties.getBaseUrl())
                        .withDetail("model", properties.getModel())
                        .build();
            } else {
                return Health.down()
                        .withDetail("component", "ollama")
                        .withDetail("error", "Unexpected response code: " + responseCode)
                        .build();
            }
        } catch (Exception e) {
            log.error("Ollama health check failed", e);
            return Health.down()
                    .withDetail("component", "ollama")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}