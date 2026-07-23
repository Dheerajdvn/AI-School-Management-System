package com.ai.dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Entry point for the AI Student Analytics Dashboard.
 *
 * <p>Provides REST endpoints for student CRUD, dashboard analytics, and an
 * AI-powered natural-language-to-SQL interface backed by a local Ollama LLM.</p>
 */
@SpringBootApplication
@EnableAsync
public class AiStudentDashboardApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiStudentDashboardApplication.class, args);
    }
}
