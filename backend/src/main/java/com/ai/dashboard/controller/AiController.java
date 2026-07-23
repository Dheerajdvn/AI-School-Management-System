package com.ai.dashboard.controller;

import com.ai.dashboard.config.OllamaProperties;
import com.ai.dashboard.dto.AiQueryRequest;
import com.ai.dashboard.dto.AiQueryResponse;
import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.ChatMessage;
import com.ai.dashboard.service.AiQueryService;
import com.ai.dashboard.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AI endpoints: natural-language-to-SQL execution + conversational chat.
 *
 * <p>Access control:
 * <ul>
 *   <li>AI query endpoints: ROLE_TEACHER and ROLE_ADMIN only</li>
 *   <li>Health check: All authenticated users</li>
 * </ul>
 *
 * <p>Note: The /ai/chat endpoint is defined in ChatController to avoid
 * mapping conflicts.</p>
 */
@Slf4j
@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Tag(name = "AI", description = "Natural-language analytics and SQL powered by Ollama")
public class AiController {

    private final AiQueryService aiQueryService;
    private final ChatService chatService;
    private final OllamaProperties ollamaProperties;

    @PostMapping("/ask")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN', 'ROLE_PRINCIPAL', 'ROLE_SCHOOL_ADMIN')")
    @Operation(summary = "Ask a natural-language question (TEACHER/ADMIN/PRINCIPAL/SCHOOL_ADMIN only)")
    public ApiResponse<AiQueryResponse> ask(@Valid @RequestBody AiQueryRequest request) {
        return ApiResponse.success(aiQueryService.ask(request));
    }

    @PostMapping("/sql")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN', 'ROLE_PRINCIPAL', 'ROLE_SCHOOL_ADMIN')")
    @Operation(summary = "Generate SQL only (TEACHER/ADMIN/PRINCIPAL/SCHOOL_ADMIN only)")
    public ApiResponse<Map<String, String>> sql(@Valid @RequestBody AiQueryRequest request) {
        return ApiResponse.success(Map.of("sql", aiQueryService.generateSqlOnly(request.getQuestion())));
    }

    @GetMapping("/health")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Check AI service health (all authenticated users)")
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.success(Map.of(
                "llmAvailable", aiQueryService.isLlmAvailable(),
                "model", ollamaProperties.getModel()));
    }
}