package com.ai.dashboard.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger / OpenAPI documentation configuration.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenApi() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("AI Student Analytics Dashboard API")
                        .version("1.0.0")
                        .description("Enterprise-grade AI-powered student analytics platform. " +
                                "Provides CRUD, dashboard analytics, and a natural-language " +
                                "to-SQL interface powered by a local Ollama LLM (qwen2.5-coder).")
                        .contact(new Contact()
                                .name("AI Dashboard Team")
                                .email("team@ai-dashboard.com"))
                        .license(new License().name("MIT").url("https://opensource.org/license/mit")));
    }
}
