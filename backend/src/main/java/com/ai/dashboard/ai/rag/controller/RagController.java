package com.ai.dashboard.ai.rag.controller;

import com.ai.dashboard.ai.rag.dto.RagChatRequest;
import com.ai.dashboard.ai.rag.dto.RagChatResponse;
import com.ai.dashboard.ai.rag.service.RagService;
import com.ai.dashboard.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.Executor;

@Slf4j
@RestController
@RequestMapping("/rag")
@Tag(name = "RAG", description = "Retrieval-Augmented Generation APIs")
public class RagController {

    private final RagService ragService;
    private final Executor taskExecutor;

    public RagController(
            RagService ragService,
            @Qualifier("documentProcessingExecutor") Executor taskExecutor
    ) {
        this.ragService = ragService;
        this.taskExecutor = taskExecutor;
    }

    @PostMapping(value = "/chat", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Ask a question using RAG")
    public ApiResponse<RagChatResponse> chat(@Valid @RequestBody RagChatRequest request) {
        log.info("RAG chat request (question length={}, courseId={})", request.getQuestion().length(), request.getCourseId());
        RagChatResponse response = ragService.answerQuestion(request.getQuestion(), request.getCourseId());
        return ApiResponse.success(response);
    }

    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Ask a question using RAG with token-by-token SSE streaming")
    public SseEmitter streamChat(@Valid @RequestBody RagChatRequest request, Authentication authentication) {
        Long userId = extractUserId(authentication);
        log.info("RAG SSE streaming request received: questionLength={}, userId={}", request.getQuestion().length(), userId);

        SseEmitter emitter = new SseEmitter(180_000L); // 3-minute timeout
        taskExecutor.execute(() -> ragService.answerQuestionStreamSse(request, emitter, userId));
        return emitter;
    }

    @PostMapping("/reindex/{documentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Reindex a single document into the vector store")
    public ApiResponse<Void> reindexDocument(@PathVariable Long documentId) {
        log.info("RAG reindex request for document {}", documentId);
        ragService.reindexDocument(documentId);
        return ApiResponse.success(null);
    }

    @PostMapping("/reindex-all")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Reindex all documents into the vector store")
    public ApiResponse<Void> reindexAll() {
        log.info("RAG reindex-all request");
        ragService.reindexAll();
        return ApiResponse.success(null);
    }

    @GetMapping("/health")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Check RAG service health")
    public ApiResponse<Boolean> health() {
        boolean isHealthy = ragService.health();
        return ApiResponse.success(isHealthy);
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication == null) return null;
        Object credentials = authentication.getCredentials();
        return credentials instanceof Long ? (Long) credentials : null;
    }
}