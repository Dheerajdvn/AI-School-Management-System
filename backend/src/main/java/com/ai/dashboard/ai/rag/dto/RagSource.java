package com.ai.dashboard.ai.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagSource {

    private Long documentId;

    private String filename;

    private int chunkId;

    private double score;
}