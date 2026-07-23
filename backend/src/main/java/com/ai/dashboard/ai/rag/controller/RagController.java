package com.ai.dashboard.ai.rag.controller;

import com.ai.dashboard.ai.rag.dto.RagChatRequest;
import com.ai.dashboard.ai.rag.dto.RagChatResponse;
import com.ai.dashboard.ai.rag.service.RagService;
import com.ai.dashboard.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/rag")
@RequiredArgsConstructor
@Tag(name = "RAG", description = "Retrieval-Augmented Generation APIs")
public class RagController {

    private final RagService ragService;

    @PostMapping(value = "/chat", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Ask a question using RAG")
    public ApiResponse<RagChatResponse> chat(@Valid @RequestBody RagChatRequest request) {
        log.info("RAG chat request (question length={}, courseId={})", request.getQuestion().length(), request.getCourseId());
        RagChatResponse response = ragService.answerQuestion(request.getQuestion(), request.getCourseId());
        return ApiResponse.success(response);
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
        boolean isHealthy = ragService.answerQuestion("health check") != null;
        return ApiResponse.success(isHealthy);
    }

    // Note: A more efficient health check would delegate to embedding and vector store
    // services directly, but the current approach reuses the RAG pipeline for simplicity.
}