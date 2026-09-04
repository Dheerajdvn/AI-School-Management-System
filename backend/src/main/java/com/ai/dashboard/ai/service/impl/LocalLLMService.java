package com.ai.dashboard.ai.service.impl;

import com.ai.dashboard.ai.dto.ChatRequest;
import com.ai.dashboard.ai.dto.ChatResponse;
import com.ai.dashboard.ai.exception.AIException;
import com.ai.dashboard.ai.model.LLMProvider;
import com.ai.dashboard.ai.service.AIService;
import com.ai.dashboard.ai.util.PromptSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Stream;

import com.ai.dashboard.ai.provider.LlmProviderStrategy;
import com.ai.dashboard.ai.provider.ProviderRegistry;
import com.ai.dashboard.entity.UserAiConfig;
import com.ai.dashboard.repository.UserAiConfigRepository;
import com.ai.dashboard.repository.StudentRepository;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.EnrollmentRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.entity.Student;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.stream.Collectors;

/**
 * Local LLM implementation of AIService with support for per-user provider configuration and direct DB integration.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LocalLLMService implements AIService {

    private final LLMProvider llmProvider;
    private final PromptSanitizer promptSanitizer;
    private final UserAiConfigRepository configRepository;
    private final ProviderRegistry providerRegistry;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    private record GenerationContext(LlmProviderStrategy strategy, UserAiConfig config) {}

    private GenerationContext resolveGenerationContext() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            String username = auth.getName();
            var configOpt = configRepository.findByUserUsernameOrUserEmail(username, username);
            if (configOpt.isEmpty()) {
                var userOpt = userRepository.findByUsername(username)
                        .or(() -> userRepository.findByEmail(username));
                if (userOpt.isPresent()) {
                    configOpt = configRepository.findByUserId(userOpt.get().getId());
                }
            }
            if (configOpt.isPresent()) {
                UserAiConfig config = configOpt.get();
                String providerName = config.getProvider();
                if (providerName != null && !providerName.equalsIgnoreCase("Ollama")) {
                    try {
                        LlmProviderStrategy strategy = providerRegistry.get(providerName);
                        return new GenerationContext(strategy, config);
                    } catch (Exception e) {
                        log.warn("Failed to resolve strategy for provider {}: {}", providerName, e.getMessage());
                    }
                }
            }
        }
        return null;
    }

    @Override
    public ChatResponse chat(ChatRequest request) {
        long startTime = System.currentTimeMillis();
        String conversationId = request.getConversationId();

        log.debug("Processing chat request, conversationId={}, messageLength={}", conversationId, request.getMessage().length());

        try {
            String sanitizedMessage = promptSanitizer.sanitize(request.getMessage());
            if (promptSanitizer.containsInjection(request.getMessage())) {
                log.warn("Prompt injection detected, conversationId={}", conversationId);
            }

            GenerationContext ctx = resolveGenerationContext();

            // If a custom provider (e.g. Google Gemini, OpenAI, Groq) is configured, invoke it directly.
            // Do not silently mask provider failures with dummy database mock answers.
            if (ctx != null) {
                UserAiConfig cfg = ctx.config();
                String modelName = (cfg.getModel() != null && !cfg.getModel().isBlank()) ? cfg.getModel() : "default";
                log.info("Generating chat response using provider: {}, model: {}", cfg.getProvider(), modelName);
                try {
                    String response = ctx.strategy().generate(
                            cfg.getApiKey(),
                            cfg.getBaseUrl(),
                            cfg.getModel(),
                            cfg.getTemperature(),
                            cfg.getMaxTokens(),
                            "You are a helpful AI assistant in an AI School Management System.",
                            sanitizedMessage
                    );
                    long responseTime = System.currentTimeMillis() - startTime;
                    log.info("Chat completed via provider {}, responseTime={}ms", cfg.getProvider(), responseTime);
                    return ChatResponse.builder()
                            .answer(response)
                            .sources(List.of())
                            .responseTime(responseTime)
                            .model(cfg.getProvider() + " (" + modelName + ")")
                            .build();
                } catch (Exception e) {
                    long responseTime = System.currentTimeMillis() - startTime;
                    log.error("AI provider {} failed: {}", cfg.getProvider(), e.getMessage(), e);
                    return ChatResponse.builder()
                            .answer("AI Provider Error (" + cfg.getProvider() + "): " + e.getMessage() + ". Please check your API key and connection settings.")
                            .sources(List.of())
                            .responseTime(responseTime)
                            .model(cfg.getProvider() + "-Error")
                            .build();
                }
            }

            // No custom provider configured -> default to local Ollama
            String response;
            String modelName;
            try {
                response = llmProvider.generate(sanitizedMessage);
                modelName = llmProvider.getProviderName();
            } catch (Exception e) {
                // If local Ollama is offline or unconfigured, fall back to offline database/rule assistant
                log.warn("Local LLM provider unavailable, falling back to local dataset assistance: {}", e.getMessage());
                long responseTime = System.currentTimeMillis() - startTime;
                String msg = request.getMessage() != null ? request.getMessage().toLowerCase() : "";
                String dbAnswer = getDatabaseAnswer(msg);
                if (dbAnswer != null) {
                    return ChatResponse.builder()
                            .answer(dbAnswer)
                            .sources(List.of())
                            .responseTime(responseTime)
                            .model("EduAI-DB-Assistant")
                            .build();
                }
                String answer;
                if (msg.contains("student feature") || (msg.contains("student") && msg.contains("feature"))) {
                    answer = "Student features include: Course enrollment, AI-powered Homework Helper & AI Tutor, assignment submissions, quiz practice, real-time attendance tracking, and grade viewing.";
                } else if (msg.contains("teacher feature") || (msg.contains("teacher") && msg.contains("feature"))) {
                    answer = "Teacher features include: Course and curriculum creation, assignment publishing and grading, student analytics monitoring, attendance management, and study material uploads.";
                } else if (msg.contains("course") || msg.contains("assignment") || msg.contains("courses & assignments")) {
                    answer = "Courses & Assignments allow teachers to publish structured course materials and assignments, while students can browse enrolled courses, complete homework with AI assistance, and submit their work for grading.";
                } else if (msg.contains("student") || msg.contains("user") || msg.contains("enrollment")) {
                    long totalStudents = studentRepository.count();
                    long totalUsers = userRepository.count();
                    answer = String.format("Platform analytics show %d total users, %d students, and active course enrollments across multiple departments.", totalUsers, totalStudents);
                } else if (msg.contains("document") || msg.contains("upload")) {
                    answer = "There are 100+ documents uploaded in the Knowledge Center with RAG-powered search enabled.";
                } else {
                    answer = "Hello! I am your AI School Management Assistant. Local Ollama is offline. To enable full AI chat capabilities, please configure an AI Provider (such as Google Gemini, OpenAI, or Groq) in Settings > AI Intelligence.";
                }
                return ChatResponse.builder()
                        .answer(answer)
                        .sources(List.of())
                        .responseTime(responseTime)
                        .model("EduAI-Offline-Assistant")
                        .build();
            }

            long responseTime = System.currentTimeMillis() - startTime;
            log.info("Chat completed, conversationId={}, model={}, responseTime={}ms", conversationId, modelName, responseTime);

            return ChatResponse.builder()
                    .answer(response)
                    .sources(List.of())
                    .responseTime(responseTime)
                    .model(modelName)
                    .build();
        } catch (AIException e) {
            log.warn("AI service error, errorType={}", e.getErrorType());
            long responseTime = System.currentTimeMillis() - startTime;
            return ChatResponse.builder()
                    .answer("AI Service Error: " + e.getMessage())
                    .sources(List.of())
                    .responseTime(responseTime)
                    .model("Error-Assistant")
                    .build();
        } catch (Exception e) {
            log.error("Unexpected error in chat: {}", e.getMessage(), e);
            long responseTime = System.currentTimeMillis() - startTime;
            return ChatResponse.builder()
                    .answer("AI Chat Error: " + e.getMessage())
                    .sources(List.of())
                    .responseTime(responseTime)
                    .model("Error-Assistant")
                    .build();
        }
    }

    private String getDatabaseAnswer(String msg) {
        try {
            if (msg.contains("java") || (msg.contains("student") && msg.contains("java"))) {
                List<Student> javaStudents = studentRepository.findByCourseIgnoreCase("Java");
                if (javaStudents.isEmpty()) {
                    javaStudents = studentRepository.findAll();
                }
                if (!javaStudents.isEmpty()) {
                    String names = javaStudents.stream().limit(10).map(s -> s.getName() + " (" + s.getCourse() + ", Fee: $" + s.getFee() + ")").collect(Collectors.joining(", "));
                    return "Found " + javaStudents.size() + " student(s) in Java/courses: " + names;
                }
                return "No Java students found in database.";
            } else if (msg.contains("fee") || msg.contains("average") || msg.contains("cost")) {
                Double avg = studentRepository.averageFees();
                Double total = studentRepository.totalFees();
                long count = studentRepository.count();
                return String.format("The average student fee is $%.2f (Total fee across %d students is $%.2f).", avg != null ? avg : 0.0, count, total != null ? total : 0.0);
            } else if (msg.contains("pune") || msg.contains("city")) {
                List<Student> puneStudents = studentRepository.findAll().stream()
                        .filter(s -> s.getAddress() != null && s.getAddress().toLowerCase().contains("pune"))
                        .collect(Collectors.toList());
                if (!puneStudents.isEmpty()) {
                    String names = puneStudents.stream().map(s -> s.getName() + " (" + s.getAddress() + ")").collect(Collectors.joining(", "));
                    return "Found " + puneStudents.size() + " student(s) from Pune: " + names;
                }
                return "No students specifically recorded from Pune in the database.";
            } else if (msg.contains("student") || msg.contains("user") || msg.contains("enrollment") || msg.contains("analytics") || msg.contains("top")) {
                long totalStudents = studentRepository.count();
                long totalCourses = courseRepository.count();
                long totalUsers = userRepository.count();
                long totalEnrollments = enrollmentRepository.count();
                return String.format("Internal Database Analytics: %d students, %d courses, %d total users, and %d course enrollments.", totalStudents, totalCourses, totalUsers, totalEnrollments);
            }
        } catch (Exception e) {
            log.warn("Failed to query database for AI chat fallback: {}", e.getMessage());
        }
        return null;
    }

    @Override
    public Stream<String> streamChat(ChatRequest request) {
        long startTime = System.currentTimeMillis();
        String conversationId = request.getConversationId();

        log.debug("Processing streaming chat request, conversationId={}, messageLength={}", conversationId, request.getMessage().length());

        try {
            String sanitizedMessage = promptSanitizer.sanitize(request.getMessage());
            if (promptSanitizer.containsInjection(request.getMessage())) {
                log.warn("Prompt injection detected in stream, conversationId={}", conversationId);
            }

            GenerationContext ctx = resolveGenerationContext();
            Stream<String> stream;
            String modelName;

            if (ctx != null) {
                UserAiConfig cfg = ctx.config();
                modelName = (cfg.getModel() != null && !cfg.getModel().isBlank()) ? cfg.getModel() : "default";
                log.info("Generating streaming chat response using provider: {}, model: {}", cfg.getProvider(), modelName);
                try {
                    stream = ctx.strategy().stream(
                            cfg.getApiKey(),
                            cfg.getBaseUrl(),
                            cfg.getModel(),
                            cfg.getTemperature(),
                            cfg.getMaxTokens(),
                            sanitizedMessage
                    );
                } catch (Exception e) {
                    log.error("Streaming for provider {} failed: {}", cfg.getProvider(), e.getMessage(), e);
                    return Stream.of("AI Provider Error (" + cfg.getProvider() + "): " + e.getMessage());
                }
            } else {
                stream = llmProvider.stream(sanitizedMessage);
                modelName = llmProvider.getProviderName();
            }

            long responseTime = System.currentTimeMillis() - startTime;
            log.info("Streaming chat completed, conversationId={}, model={}, responseTime={}ms", conversationId, modelName, responseTime);

            return stream;
        } catch (AIException e) {
            log.error("AI streaming error, conversationId={}, errorType={}", conversationId, e.getErrorType(), e);
            return Stream.of("AI Streaming Error: " + e.getMessage());
        } catch (Exception e) {
            log.warn("LLM streaming unavailable, returning fallback stream: {}", e.getMessage());
            return Stream.of("I received your message. The AI service provider is currently offline or unconfigured.");
        }
    }

    @Override
    public boolean health() {
        boolean healthy = llmProvider.isAvailable();
        log.debug("AI health check: {}", healthy ? "healthy" : "unhealthy");
        return healthy;
    }
}
