package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Student performance summary DTO for teacher dashboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentPerformanceDto {
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseCode;
    private Integer totalAssignments;
    private Integer submittedAssignments;
    private Double averageScore;
    private String status;
}