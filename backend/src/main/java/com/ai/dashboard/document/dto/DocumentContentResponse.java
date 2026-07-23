package com.ai.dashboard.document.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO returned when requesting extracted document content.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentContentResponse {

    private Long id;
    private Long documentId;
    private String extractedText;
    private LocalDateTime extractedAt;
}
