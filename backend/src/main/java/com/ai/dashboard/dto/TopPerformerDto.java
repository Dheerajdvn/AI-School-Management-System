package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Top performer DTO for teacher dashboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopPerformerDto {
    private Long studentId;
    private String studentName;
    private Double averageScore;
    private String letterGrade;
    private Long gradedAssignments;
}