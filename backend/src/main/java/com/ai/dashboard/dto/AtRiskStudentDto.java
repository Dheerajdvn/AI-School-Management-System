package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * At-risk student DTO for teacher dashboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtRiskStudentDto {
    private Long studentId;
    private String studentName;
    private Double averageScore;
    private String letterGrade;
    private Long missedAssignments;
    private Long lateSubmissions;
    private String riskLevel;
}