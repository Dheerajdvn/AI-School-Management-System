package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Admin dashboard response DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    // User statistics
    private Long totalUsers;
    private Long students;
    private Long teachers;

    // Course statistics
    private Long courses;
    private Long activeEnrollments;

    // Assignment statistics
    private Long assignments;

    // Submission statistics
    private Long submissions;
    private Long gradesPublished;

    // Performance statistics
    private Double averagePlatformScore;

    // Recent activity
    private List<RecentUserDto> recentlyRegisteredUsers;
    private List<RecentCourseDto> recentlyCreatedCourses;

    // System statistics
    private List<ChartDataPoint> userGrowth;
    private List<ChartDataPoint> gradeDistribution;
    private List<ChartDataPoint> monthlySubmissions;
    private List<ChartDataPoint> monthlyRegistrations;
    private List<ChartDataPoint> courseCompletion;
}