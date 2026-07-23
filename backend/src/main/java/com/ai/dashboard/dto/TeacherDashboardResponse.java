package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Teacher dashboard response DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDashboardResponse {

    // Course statistics
    private Long coursesTaught;
    private Long totalStudents;
    private Long activeAssignments;
    private Integer pendingGradingCount;

    // Performance statistics
    private Double averageClassScore;
    private Double assignmentCompletionRate;

    // Recent submissions
    private List<SubmissionResponse> recentlySubmitted;

    // Recently graded
    private List<GradeResponse> recentlyGraded;

    // Student performance
    private List<StudentPerformanceDto> studentPerformance;

    // Top performers
    private List<TopPerformerDto> topPerformers;

    // At-risk students
    private List<AtRiskStudentDto> atRiskStudents;
}