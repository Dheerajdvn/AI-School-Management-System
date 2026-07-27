package com.ai.dashboard.document.service;

import com.ai.dashboard.document.dto.KnowledgeDashboardResponse;

/**
 * Service interface for AI Knowledge Dashboard metrics and operations.
 */
public interface KnowledgeDashboardService {

    /**
     * Get dynamic dashboard statistics for AI Knowledge Center.
     *
     * @return KnowledgeDashboardResponse containing document and collection metrics
     */
    KnowledgeDashboardResponse getDashboardStats();
}
