package com.ai.dashboard.controller;

import com.ai.dashboard.dto.*;
import com.ai.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for dashboard statistics, metrics, and analytics endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard and analytics APIs")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/student")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    @Operation(summary = "Get student dashboard")
    public ApiResponse<StudentDashboardResponse> getStudentDashboard(Authentication authentication) {
        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);
        return ApiResponse.success(dashboardService.getStudentDashboard(currentUserId, currentUserRole));
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Get teacher dashboard")
    public ApiResponse<TeacherDashboardResponse> getTeacherDashboard(Authentication authentication) {
        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);
        return ApiResponse.success(dashboardService.getTeacherDashboard(currentUserId, currentUserRole));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get admin dashboard")
    public ApiResponse<AdminDashboardResponse> getAdminDashboard(Authentication authentication) {
        String currentUserRole = getCurrentUserRole(authentication);
        return ApiResponse.success(dashboardService.getAdminDashboard(currentUserRole));
    }

    @GetMapping("/totals")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get dashboard totals")
    public ApiResponse<Map<String, Object>> getTotals() {
        return ApiResponse.success(dashboardService.getTotals());
    }

    @GetMapping("/enrollment-by-course")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get enrollment counts by course")
    public ApiResponse<List<Map<String, Object>>> getEnrollmentByCourse() {
        return ApiResponse.success(dashboardService.getEnrollmentByCourse());
    }

    @GetMapping("/documents-monthly")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get enrollment activity per month for the last N months")
    public ApiResponse<Map<String, Object>> getDocumentsMonthly(@RequestParam(defaultValue = "12") int months) {
        return ApiResponse.success(dashboardService.getDocumentsMonthly(months));
    }

    @GetMapping("/recent-documents")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get recent enrollments")
    public ApiResponse<List<Map<String, Object>>> getRecentDocuments(@RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.success(dashboardService.getRecentDocuments(limit));
    }

    @GetMapping("/recent-students")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get recent students")
    public ApiResponse<List<Map<String, Object>>> getRecentStudents(@RequestParam(defaultValue = "5") int size) {
        return ApiResponse.success(dashboardService.getRecentStudents(size));
    }

    @GetMapping("/user-growth")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user growth over last N months")
    public ApiResponse<Map<String, Object>> getUserGrowth(@RequestParam(defaultValue = "12") int months) {
        return ApiResponse.success(dashboardService.getUserGrowth(months));
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication == null) return null;
        Object details = authentication.getDetails();
        if (details instanceof Long longId) {
            return longId;
        }
        return null;
    }

    private String getCurrentUserRole(Authentication authentication) {
        if (authentication == null) return "ROLE_STUDENT";
        return authentication.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("ROLE_STUDENT");
    }
}