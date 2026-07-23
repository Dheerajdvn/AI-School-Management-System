package com.ai.dashboard.ai.service;

import com.ai.dashboard.ai.dto.ChatRequest;
import com.ai.dashboard.ai.dto.ChatResponse;

/**
 * Service interface for AI chat operations.
 */
public interface AIService {

    /**
     * Generate a chat response.
     *
     * @param request the chat request
     * @return the chat response
     */
    ChatResponse chat(ChatRequest request);

    /**
     * Generate a streaming chat response.
     *
     * @param request the chat request
     * @return a stream of response chunks
     */
    java.util.stream.Stream<String> streamChat(ChatRequest request);

    /**
     * Health check for the AI service.
     *
     * @return true if the service is healthy
     */
    boolean health();
}