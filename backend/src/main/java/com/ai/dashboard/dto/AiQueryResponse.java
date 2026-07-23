package com.ai.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Structured response returned after AI-generated SQL has been executed.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AiQueryResponse {

    /** Original user question */
    private String question;

    /** SQL produced by the LLM */
    private String sql;

    /** Short human-friendly summary of what the query returned */
    private String summary;

    /** The execution result rows (list of field-name -> value) */
    private List<Map<String, Object>> rows;

    /** Total number of rows returned */
    private int rowCount;

    /** Optional chart recommendation derived from the result shape */
    private String chartType;

    /** Any warning (e.g. SQL sanitised, truncated) */
    private String warning;
}
