package com.ai.dashboard.service;

import com.ai.dashboard.dto.*;

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
}