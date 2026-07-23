package com.ai.dashboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Natural-language question sent to the AI module.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiQueryRequest {

    @NotBlank(message = "Question must not be blank")
    @Size(max = 500, message = "Question must not exceed 500 characters")
    private String question;
}
