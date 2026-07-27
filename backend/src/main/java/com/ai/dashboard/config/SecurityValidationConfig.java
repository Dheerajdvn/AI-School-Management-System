package com.ai.dashboard.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

/**
 * Startup security validation bean verifying critical credentials and secrets.
 */
@Slf4j
@Configuration
public class SecurityValidationConfig implements InitializingBean {

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Value("${ai.ollama.base-url:}")
    private String ollamaBaseUrl;

    private static final String INSECURE_DEFAULT_JWT = "local-development-jwt-secret-change-me-please-rotate";

    @Override
    public void afterPropertiesSet() throws Exception {
        log.info("Validating system security configuration at startup...");

        if (!StringUtils.hasText(jwtSecret)) {
            throw new IllegalStateException("CRITICAL SECURITY VULNERABILITY: app.jwt.secret is missing or empty.");
        }

        if (INSECURE_DEFAULT_JWT.equalsIgnoreCase(jwtSecret)) {
            throw new IllegalStateException("CRITICAL SECURITY VULNERABILITY: Insecure default JWT secret detected! Override JWT_SECRET environment variable.");
        }

        if (jwtSecret.length() < 32) {
            throw new IllegalStateException("CRITICAL SECURITY VULNERABILITY: app.jwt.secret must be at least 32 characters long for HMAC-SHA signing safety.");
        }

        if (!StringUtils.hasText(ollamaBaseUrl)) {
            throw new IllegalStateException("CONFIGURATION ERROR: ai.ollama.base-url is missing.");
        }

        log.info("Startup security configuration validation passed successfully.");
    }
}
