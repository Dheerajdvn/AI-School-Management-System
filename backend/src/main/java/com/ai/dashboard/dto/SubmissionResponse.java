package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for submission response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {

    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private String assignmentCode;
    private Long studentId;
    private String studentName;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private String status;
    private String submissionText;
    private String attachmentUrl;
    private Integer obtainedMarks;
    private String feedback;
    private LocalDateTime gradedAt;
    private Long gradedById;
    private String gradedByName;
}