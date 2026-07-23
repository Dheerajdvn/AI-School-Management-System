package com.ai.dashboard.ai.rag.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagChatRequest {

    @NotBlank(message = "Question must not be blank")
    @Size(max = 2000, message = "Question must not exceed 2000 characters")
    private String question;

    private Long courseId;
}