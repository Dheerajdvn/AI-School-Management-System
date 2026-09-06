package com.ai.dashboard.mcp.tools.impl;

import com.ai.dashboard.ai.embedding.service.EmbeddingService;
import com.ai.dashboard.ai.rag.model.DocumentChunk;
import com.ai.dashboard.ai.rag.repository.DocumentChunkRepository;
import com.ai.dashboard.ai.vector.dto.SearchResult;
import com.ai.dashboard.ai.vector.service.VectorStoreService;
import com.ai.dashboard.mcp.tools.McpTool;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * MCP Tool for searching course textbooks and syllabus documents via Qdrant vector search.
 * Token optimized: Limits chunk preview size to prevent context window bloat.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class KnowledgeSearchMcpTool implements McpTool {

    private final EmbeddingService embeddingService;
    private final VectorStoreService vectorStoreService;
    private final DocumentChunkRepository documentChunkRepository;

    @Override
    public String getName() {
        return "search_course_knowledge";
    }

    @Override
    public String getDescription() {
        return "Searches uploaded textbooks, syllabi, and lecture materials for answers. Use when the user asks academic or course concept questions.";
    }

    @Override
    public Map<String, Object> getInputSchema() {
        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "object");

        Map<String, Object> properties = new LinkedHashMap<>();

        Map<String, Object> queryProp = new LinkedHashMap<>();
        queryProp.put("type", "string");
        queryProp.put("description", "Search query or concept keywords");
        properties.put("query", queryProp);

        Map<String, Object> courseIdProp = new LinkedHashMap<>();
        courseIdProp.put("type", "integer");
        courseIdProp.put("description", "Optional course ID to filter results");
        properties.put("courseId", courseIdProp);

        schema.put("properties", properties);
        schema.put("required", List.of("query"));
        return schema;
    }

    @Override
    public boolean isAuthorized(Authentication authentication) {
        // Available to all authenticated students, teachers, and admins (rejects anonymousUser)
        return authentication != null 
                && authentication.isAuthenticated() 
                && !"anonymousUser".equals(authentication.getPrincipal());
    }

    @Override
    public Map<String, Object> execute(Map<String, Object> arguments, Authentication authentication) {
        String query = (String) arguments.get("query");
        if (query == null || query.isBlank()) {
            return Map.of("error", "Query parameter is required", "results", List.of());
        }

        Long courseId = null;
        Object cidObj = arguments.get("courseId");
        if (cidObj instanceof Number) {
            courseId = ((Number) cidObj).longValue();
        }

        log.info("MCP search_course_knowledge executing: query='{}', courseId={}", query, courseId);

        try {
            List<Float> embedding = embeddingService.generateEmbedding(query);
            List<SearchResult> searchResults = vectorStoreService.searchSimilar(embedding, 3, courseId);

            if (searchResults.isEmpty()) {
                return Map.of("message", "No matching textbook or syllabus records found in knowledge base.", "results", List.of());
            }

            List<Long> docIds = searchResults.stream().map(SearchResult::getDocumentId).distinct().toList();
            List<DocumentChunk> chunks = documentChunkRepository.findByDocumentIdIn(docIds);
            Map<String, String> chunkMap = new HashMap<>();
            for (DocumentChunk c : chunks) {
                chunkMap.put(c.getDocumentId() + "_" + c.getChunkIndex(), c.getContent());
            }

            List<Map<String, Object>> compactResults = new ArrayList<>();
            for (SearchResult r : searchResults) {
                String content = chunkMap.getOrDefault(r.getDocumentId() + "_" + r.getChunkId(), "");
                // Token optimization: truncate chunk content to max 350 chars to save prompt tokens
                String truncatedContent = content.length() > 350 ? content.substring(0, 350) + "..." : content;

                Map<String, Object> item = new LinkedHashMap<>();
                item.put("document", r.getFilename() != null ? r.getFilename() : "Document #" + r.getDocumentId());
                item.put("chunk", r.getChunkId());
                item.put("score", Math.round(r.getScore() * 100.0) / 100.0);
                item.put("content", truncatedContent);
                compactResults.add(item);
            }

            return Map.of("count", compactResults.size(), "results", compactResults);
        } catch (Exception e) {
            log.error("MCP search_course_knowledge failed: {}", e.getMessage(), e);
            return Map.of("error", "Failed to search knowledge base: " + e.getMessage());
        }
    }
}
