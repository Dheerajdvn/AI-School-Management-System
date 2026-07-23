package com.ai.dashboard.ai.embedding.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for embedding generation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddingRequest {

    @NotBlank(message = "Text must not be blank")
    @Size(max = 8192, message = "Text must not exceed 8192 characters")
    private String text;
}