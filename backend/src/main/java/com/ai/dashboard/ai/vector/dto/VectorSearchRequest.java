package com.ai.dashboard.ai.vector.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for vector search.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VectorSearchRequest {

    @NotEmpty(message = "Embedding must not be empty")
    private List<Float> embedding;

    @Min(value = 1, message = "topK must be at least 1")
    @Max(value = 100, message = "topK must not exceed 100")
    @Builder.Default
    private int topK = 10;

    /** Minimum score threshold for filtering results (0.0 to 1.0). */
    @Min(value = 0, message = "score threshold must be at least 0")
    @Max(value = 1, message = "score threshold must not exceed 1")
    @Builder.Default
    private double scoreThreshold = 0.0;
}
