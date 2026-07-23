package com.ai.dashboard.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Production-grade metrics configuration.
 * Provides Prometheus scraping endpoint for monitoring.
 */
@Slf4j
@Configuration
public class MetricsConfig {

    /**
     * Default timer configuration for performance monitoring.
     */
    @Bean
    public Timer defaultTimer(MeterRegistry registry) {
        return Timer.builder("application.requests")
                .description("Application request timing")
                .register(registry);
    }
}
