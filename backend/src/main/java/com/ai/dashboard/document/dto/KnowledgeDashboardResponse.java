package com.ai.dashboard.document.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Response DTO for AI Knowledge Dashboard statistics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeDashboardResponse {

    private long totalDocuments;
    private long totalCollections;
    private long indexedDocuments;
    private long pendingDocuments;
    private long failedDocuments;

    @Builder.Default
    private List<DocumentResponse> recentUploads = new ArrayList<>();

    @Builder.Default
    private List<Object> uploadsPerDay = new ArrayList<>();

    @Builder.Default
    private List<Object> documentsByCollection = new ArrayList<>();

    @Builder.Default
    private List<Object> documentsByType = new ArrayList<>();
}
