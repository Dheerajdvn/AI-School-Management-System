package com.ai.dashboard.service;

import com.ai.dashboard.dto.AiQueryRequest;
import com.ai.dashboard.dto.AiQueryResponse;

/**
 * Contract for the natural-language to SQL execution pipeline.
 */
public interface AiQueryService {

    /**
     * Convert a natural language question to SQL, validate it, execute it,
     * and return a structured response.
     */
    AiQueryResponse ask(AiQueryRequest request);

    /**
     * Same as {@link #ask} but only returns the generated SQL without executing.
     */
    String generateSqlOnly(String question);

    /**
     * Health check against the underlying LLM server.
     */
    boolean isLlmAvailable();
}
