package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Course progress DTO for student dashboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressDto {
    private Long courseId;
    private String courseCode;
    private String courseTitle;
    private Integer totalAssignments;
    private Integer submittedAssignments;
    private Double completionPercentage;
    private Double averageScore;
}