package com.ai.dashboard.ai.embedding.controller;

import com.ai.dashboard.ai.embedding.dto.EmbeddingRequest;
import com.ai.dashboard.ai.embedding.dto.EmbeddingResponse;
import com.ai.dashboard.ai.embedding.service.EmbeddingService;
import com.ai.dashboard.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Embedding REST endpoints.
 *
 * <p>Access control:
 * <ul>
 *   <li>Embedding generation: All authenticated users</li>
 *   <li>Health check: All authenticated users</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/ai/embedding")
@RequiredArgsConstructor
@Tag(name = "Embedding", description = "Text Embedding APIs powered by Ollama")
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Generate an embedding vector for the given text")
    public ApiResponse<EmbeddingResponse> generateEmbedding(@Valid @RequestBody EmbeddingRequest request) {
        log.info("Embedding request received (text length={})", request.getText().length());
        List<Float> embedding = embeddingService.generateEmbedding(request.getText());
        EmbeddingResponse response = EmbeddingResponse.builder()
                .dimension(embedding.size())
                .embedding(embedding)
                .build();
        return ApiResponse.success(response);
    }

    @GetMapping("/health")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Check embedding service health")
    public ApiResponse<Map<String, Boolean>> health() {
        boolean isHealthy = embeddingService.health();
        return ApiResponse.success(Map.of("healthy", isHealthy));
    }
}
