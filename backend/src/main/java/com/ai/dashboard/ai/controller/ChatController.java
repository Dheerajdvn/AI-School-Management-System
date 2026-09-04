package com.ai.dashboard.ai.controller;

import com.ai.dashboard.ai.dto.ChatRequest;
import com.ai.dashboard.ai.dto.ChatResponse;
import com.ai.dashboard.ai.service.AIService;
import com.ai.dashboard.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * AI Chat REST endpoints.
 *
 * Access control:
 * - Chat endpoints: All authenticated users
 *
 * Note:
 * - Health endpoint is provided by AiController to avoid duplicate mappings.
 */
@Slf4j
@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Tag(name = "AI Chat", description = "AI Chat APIs")
public class ChatController {

    private final AIService aiService;

    @PostMapping("/chat")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Generate a chat response")
    public ApiResponse<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {

        log.info("Received chat request for conversation: {}", request.getConversationId());

        ChatResponse response = aiService.chat(request);

        return ApiResponse.success(response);
    }

    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_PLAIN_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Generate a streaming chat response")
    public String streamChat(@RequestBody ChatRequest request) {

        log.info("Received streaming chat request for conversation: {}", request.getConversationId());

        StringBuilder fullResponse = new StringBuilder();

        aiService.streamChat(request).forEach(fullResponse::append);

        return fullResponse.toString();
    }
}