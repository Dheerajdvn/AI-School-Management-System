package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic dashboard statistics DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private Long totalCourses;
    private Long totalStudents;
    private Long totalTeachers;
    private Long totalSubmissions;
    private Long totalGrades;
    private Double averageScore;
    private Long pendingGrading;
}