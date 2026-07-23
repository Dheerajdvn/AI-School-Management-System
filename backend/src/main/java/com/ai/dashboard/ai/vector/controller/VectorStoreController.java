package com.ai.dashboard.ai.vector.controller;

import com.ai.dashboard.ai.vector.dto.SearchResult;
import com.ai.dashboard.ai.vector.dto.VectorSearchRequest;
import com.ai.dashboard.ai.vector.service.VectorStoreService;
import com.ai.dashboard.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Vector store REST endpoints.
 *
 * <p>Access control:
 * <ul>
 *   <li>Search: All authenticated users</li>
 *   <li>Delete: ADMIN and TEACHER only</li>
 *   <li>Health: All authenticated users</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/ai/vector")
@RequiredArgsConstructor
@Tag(name = "Vector Store", description = "Qdrant Vector Database APIs")
public class VectorStoreController {

    private final VectorStoreService vectorStoreService;

    @PostMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Search similar documents by embedding vector")
    public ApiResponse<List<SearchResult>> search(@Valid @RequestBody VectorSearchRequest request) {
        log.info("Vector search request received (topK={})", request.getTopK());
        List<SearchResult> results = vectorStoreService.searchSimilar(request.getEmbedding(), request.getTopK());
        return ApiResponse.success(results);
    }

    @DeleteMapping("/documents/{documentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Delete all vectors for a document")
    public ApiResponse<Void> deleteDocumentVectors(@PathVariable long documentId) {
        log.info("Delete vectors request for document {}", documentId);
        vectorStoreService.deleteDocumentVectors(documentId);
        return ApiResponse.success(null);
    }

    @GetMapping("/health")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Check vector store health")
    public ApiResponse<Map<String, Boolean>> health() {
        boolean isHealthy = vectorStoreService.health();
        return ApiResponse.success(Map.of("healthy", isHealthy));
    }
}
