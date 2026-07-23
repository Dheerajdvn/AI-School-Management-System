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

/**
 * Local LLM implementation of AIService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LocalLLMService implements AIService {

    private final LLMProvider llmProvider;
    private final PromptSanitizer promptSanitizer;

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

            String response = llmProvider.generate(sanitizedMessage);
            long responseTime = System.currentTimeMillis() - startTime;

            log.info("Chat completed, conversationId={}, model={}, responseTime={}ms", conversationId, llmProvider.getProviderName(), responseTime);

            return ChatResponse.builder()
                    .answer(response)
                    .sources(List.of())
                    .responseTime(responseTime)
                    .model(llmProvider.getProviderName())
                    .build();
        } catch (AIException e) {
            log.error("AI service error, conversationId={}, errorType={}", conversationId, e.getErrorType(), e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error in chat processing, conversationId={}", conversationId, e);
            throw new AIException(AIException.ErrorType.UNKNOWN, "Failed to generate response: " + e.getMessage(), e);
        }
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

            Stream<String> stream = llmProvider.stream(sanitizedMessage);

            long responseTime = System.currentTimeMillis() - startTime;
            log.info("Streaming chat completed, conversationId={}, model={}, responseTime={}ms", conversationId, llmProvider.getProviderName(), responseTime);

            return stream;
        } catch (AIException e) {
            log.error("AI streaming error, conversationId={}, errorType={}", conversationId, e.getErrorType(), e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error in streaming chat, conversationId={}", conversationId, e);
            throw new AIException(AIException.ErrorType.UNKNOWN, "Failed to generate streaming response: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean health() {
        boolean healthy = llmProvider.isAvailable();
        log.debug("AI health check: {}", healthy ? "healthy" : "unhealthy");
        return healthy;
    }
}
