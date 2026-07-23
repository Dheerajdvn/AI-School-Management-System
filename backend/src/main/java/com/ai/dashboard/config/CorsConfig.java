package com.ai.dashboard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Allows the React front-end (running on a different origin) to call the API.
 *
 * <p>Note: SecurityConfig also defines CORS via CorsConfigurationSource bean.
 * This class provides a WebMvcConfigurer fallback for non-Spring-Security routes.
 * The SecurityConfig bean takes precedence for secured endpoints.</p>
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}