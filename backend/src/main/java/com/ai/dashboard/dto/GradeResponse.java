package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for grade response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeResponse {

    private Long id;
    private Long submissionId;
    private Long assignmentId;
    private String assignmentTitle;
    private String assignmentCode;
    private Long studentId;
    private String studentName;
    private Integer obtainedMarks;
    private Integer maxMarks;
    private Double percentage;
    private String letterGrade;
    private String passFail;
    private String feedback;
    private String privateNotes;
    private Boolean published;
    private LocalDateTime gradedAt;
    private Long gradedById;
    private String gradedByName;
}