package com.ai.dashboard.ai.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Streaming response DTO for RAG chat.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagChatStreamResponse {

    private String content;
    
    private boolean complete;
    
    private Long documentId;
    
    private Integer chunkId;
    
    private String filename;
    
    private Double score;

    private Integer tokenCount;

    private Long responseTimeMs;

    private Double confidenceScore;

    private List<RagSource> sources;
}