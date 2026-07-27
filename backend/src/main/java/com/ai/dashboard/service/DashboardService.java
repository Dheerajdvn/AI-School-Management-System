package com.ai.dashboard.service;

import com.ai.dashboard.dto.*;
import java.util.List;
import java.util.Map;

/**
 * Service interface for dashboard operations.
 */
public interface DashboardService {

    /**
     * Get student dashboard.
     */
    StudentDashboardResponse getStudentDashboard(Long studentId, String currentUserRole);

    /**
     * Get teacher dashboard.
     */
    TeacherDashboardResponse getTeacherDashboard(Long teacherId, String currentUserRole);

    /**
     * Get admin dashboard.
     */
    AdminDashboardResponse getAdminDashboard(String currentUserRole);

    /**
     * Get overall platform dashboard totals.
     */
    Map<String, Object> getTotals();

    /**
     * Get enrollment counts grouped by course.
     */
    List<Map<String, Object>> getEnrollmentByCourse();

    /**
     * Get monthly enrollment activity for the last N months.
     */
    Map<String, Object> getDocumentsMonthly(int months);

    /**
     * Get recent enrollments with initialized course and student metadata.
     */
    List<Map<String, Object>> getRecentDocuments(int limit);

    /**
     * Get recently registered student users.
     */
    List<Map<String, Object>> getRecentStudents(int size);

    /**
     * Get user growth over the last N months.
     */
    Map<String, Object> getUserGrowth(int months);
}