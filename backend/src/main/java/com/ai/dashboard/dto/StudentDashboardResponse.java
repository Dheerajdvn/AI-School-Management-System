package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Student dashboard response DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardResponse {

    // Course statistics
    private Long totalEnrolledCourses;
    private Long activeCourses;
    private Long completedCourses;

    // Assignment statistics
    private Integer pendingAssignments;
    private Integer submittedAssignments;
    private Integer lateSubmissions;

    // Grade statistics
    private Double averagePercentage;
    private Double gpa;

    // Recent grades
    private List<GradeResponse> recentGrades;

    // Upcoming deadlines
    private List<UpcomingAssignmentDto> upcomingDeadlines;

    // Course progress
    private List<CourseProgressDto> courseProgress;

    // Notifications
    private List<NotificationDto> recentNotifications;
}