package com.ai.dashboard.ai.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagChatResponse {

    private String answer;

    private List<RagSource> sources;

    private double confidenceScore;

    private List<String> retrievedChunks;

    private long responseTime;
}