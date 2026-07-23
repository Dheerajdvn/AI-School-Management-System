package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for grade history response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeHistoryResponse {

    private Long id;
    private Integer previousMarks;
    private Integer newMarks;
    private String previousFeedback;
    private String newFeedback;
    private String privateNotes;
    private Long updatedById;
    private String updatedByName;
    private LocalDateTime updatedAt;
}