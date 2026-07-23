package com.ai.dashboard.config.health;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;

/**
 * Health indicator for Redis connectivity.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RedisHealthIndicator implements HealthIndicator {

    private final RedisConnectionFactory redisConnectionFactory;

    @Override
    public Health health() {
        try {
            var connection = redisConnectionFactory.getConnection();
            connection.ping();
            connection.close();
            log.debug("Redis health check: UP");
            return Health.up()
                    .withDetail("component", "redis")
                    .withDetail("status", "Available")
                    .build();
        } catch (Exception e) {
            log.error("Redis health check failed", e);
            return Health.down()
                    .withDetail("component", "redis")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}