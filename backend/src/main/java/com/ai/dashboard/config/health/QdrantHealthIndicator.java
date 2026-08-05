package com.ai.dashboard.config.health;

import com.ai.dashboard.ai.vector.config.VectorStoreProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

/**
 * Health indicator for Qdrant Vector Store connectivity.
 */
@Slf4j
@Component
public class QdrantHealthIndicator implements HealthIndicator {

    private final WebClient webClient;
    private final VectorStoreProperties properties;

    public QdrantHealthIndicator(@Qualifier("qdrantWebClient") WebClient webClient,
                                 VectorStoreProperties properties) {
        this.webClient = webClient;
        this.properties = properties;
    }

    @Override
    public Health health() {
        try {
            String response = webClient.get()
                    .uri("/collections/" + properties.getCollection())
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            if (response != null && response.contains("result")) {
                log.debug("Qdrant health check: UP");
                return Health.up()
                        .withDetail("component", "qdrant")
                        .withDetail("collection", properties.getCollection())
                        .build();
            } else {
                return Health.down()
                        .withDetail("component", "qdrant")
                        .withDetail("error", "Invalid response from Qdrant")
                        .build();
            }
        } catch (Exception e) {
            log.warn("Qdrant health check failed: {}", e.getMessage());
            return Health.down()
                    .withDetail("component", "qdrant")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
