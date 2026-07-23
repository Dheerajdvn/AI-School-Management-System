package com.ai.dashboard.controller;

import com.ai.dashboard.dto.*;
import com.ai.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard and analytics APIs")
public class DashboardController {

    private final DashboardService dashboardService;
    private final com.ai.dashboard.repository.CourseRepository courseRepository;
    private final com.ai.dashboard.repository.EnrollmentRepository enrollmentRepository;
    private final com.ai.dashboard.repository.UserRepository userRepository;
    private final com.ai.dashboard.repository.StudentRepository studentRepository;
    private final com.ai.dashboard.document.repository.DocumentRepository documentRepository;
    private final com.ai.dashboard.ai.rag.repository.ChatMessageRepository chatMessageRepository;

    @GetMapping("/student")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    @Operation(summary = "Get student dashboard")
    public ApiResponse<StudentDashboardResponse> getStudentDashboard(Authentication authentication) {
        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        StudentDashboardResponse response = dashboardService.getStudentDashboard(currentUserId, currentUserRole);
        return ApiResponse.success(response);
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Get teacher dashboard")
    public ApiResponse<TeacherDashboardResponse> getTeacherDashboard(Authentication authentication) {
        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        TeacherDashboardResponse response = dashboardService.getTeacherDashboard(currentUserId, currentUserRole);
        return ApiResponse.success(response);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get admin dashboard")
    public ApiResponse<AdminDashboardResponse> getAdminDashboard(Authentication authentication) {
        String currentUserRole = getCurrentUserRole(authentication);

        AdminDashboardResponse response = dashboardService.getAdminDashboard(currentUserRole);
        return ApiResponse.success(response);
    }

    @GetMapping("/totals")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get dashboard totals")
    public ApiResponse<Map<String, Object>> getTotals(Authentication authentication) {
        long totalUsers = userRepository.count();
        long students = studentRepository.count();
        long teachers = userRepository.count(com.ai.dashboard.repository.UserSpecifications.hasRole("ROLE_TEACHER"));
        long courses = courseRepository.count();
        long documents = documentRepository != null ? documentRepository.count() : 0L;
        long aiChats = chatMessageRepository != null ? chatMessageRepository.count() : 0L;

        Map<String, Object> totals = new HashMap<>();
        totals.put("totalUsers", totalUsers);
        totals.put("users", totalUsers);
        totals.put("students", students);
        totals.put("teachers", teachers);
        totals.put("courses", courses);
        totals.put("documents", documents);
        totals.put("aiChats", aiChats);
        totals.put("roles", Map.of(
                "ADMIN", teachers,
                "STUDENT", students,
                "TEACHER", teachers
        ));
        return ApiResponse.success(totals);
    }

    @GetMapping("/enrollment-by-course")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get enrollment counts by course")
    public ApiResponse<List<Map<String, Object>>> getEnrollmentByCourse(Authentication authentication) {
        List<com.ai.dashboard.entity.Course> courses = courseRepository.findAll();
        List<Map<String, Object>> result = courses.stream()
                .map(course -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("label", course.getTitle() != null ? course.getTitle() : course.getCourseCode());
                    long count = enrollmentRepository.findAll(
                            org.springframework.data.jpa.domain.Specification.where(
                                    com.ai.dashboard.repository.EnrollmentSpecifications.hasCourseId(course.getId())
                            )
                    ).stream().count();
                    entry.put("value", count);
                    return entry;
                })
                .collect(Collectors.toList());
        return ApiResponse.success(result);
    }

    @GetMapping("/documents-monthly")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get enrollment activity per month for the last N months")
    public ApiResponse<Map<String, Object>> getDocumentsMonthly(
            @RequestParam(defaultValue = "12") int months,
            Authentication authentication) {
        LocalDate now = LocalDate.now();
        LocalDate start = now.minusMonths(months - 1).withDayOfMonth(1);

        List<com.ai.dashboard.entity.Enrollment> enrollments = enrollmentRepository.findAll();

        Map<Integer, Long> countsByMonth = new HashMap<>();
        for (int i = 0; i < 12; i++) {
            countsByMonth.put(i, 0L);
        }

        for (com.ai.dashboard.entity.Enrollment enrollment : enrollments) {
            java.time.LocalDate enrollmentDate = enrollment.getEnrollmentDate();
            if (enrollmentDate != null && !enrollmentDate.isBefore(start)) {
                int monthIndex = 11 - (int) ChronoUnit.MONTHS.between(
                        enrollmentDate.withDayOfMonth(1),
                        now.withDayOfMonth(1)
                );
                if (monthIndex >= 0 && monthIndex < 12) {
                    countsByMonth.merge(monthIndex, 1L, Long::sum);
                }
            }
        }

        List<String> labels = new ArrayList<>();
        List<Long> values = new ArrayList<>();

        for (int i = months - 1; i >= 0; i--) {
            LocalDate month = now.minusMonths(i).withDayOfMonth(1);
            String label = month.getMonth().name().substring(0, 3) + " " + month.getYear();
            labels.add(label);
            int monthIndex = 11 - i;
            values.add(monthIndex < 12 ? countsByMonth.getOrDefault(monthIndex, 0L) : 0L);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("values", values);
        return ApiResponse.success(response);
    }

    @GetMapping("/recent-documents")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get recent enrollments")
    public ApiResponse<List<Map<String, Object>>> getRecentDocuments(
            @RequestParam(defaultValue = "5") int limit,
            Authentication authentication) {
        List<com.ai.dashboard.entity.Enrollment> recent = enrollmentRepository.findAll(
                PageRequest.of(0, limit, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "enrollmentDate"))
        ).getContent();

        List<Map<String, Object>> docs = recent.stream().map(enrollment -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", enrollment.getId());
            map.put("name", "Enrollment: " + (enrollment.getCourse() != null ? enrollment.getCourse().getCourseCode() : "Unknown"));
            map.put("uploadTime", enrollment.getEnrollmentDate() != null ? enrollment.getEnrollmentDate().atStartOfDay() : null);
            map.put("uploadedBy", enrollment.getStudent() != null ? enrollment.getStudent().getUsername() : "Unknown");
            return map;
        }).collect(Collectors.toList());

        return ApiResponse.success(docs);
    }

    @GetMapping("/recent-students")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get recent students")
    public ApiResponse<List<Map<String, Object>>> getRecentStudents(
            @RequestParam(defaultValue = "5") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(0, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
        List<com.ai.dashboard.entity.User> students = userRepository.findAll(
                org.springframework.data.jpa.domain.Specification.where(com.ai.dashboard.repository.UserSpecifications.hasRole("ROLE_STUDENT")),
                pageable
        ).getContent();

        List<Map<String, Object>> result = students.stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("name", user.getUsername());
            map.put("email", user.getEmail());
            map.put("createdAt", user.getCreatedAt());
            map.put("enabled", user.isEnabled());
            return map;
        }).collect(Collectors.toList());

        return ApiResponse.success(result);
    }

    @GetMapping("/user-growth")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user growth over last N months")
    public ApiResponse<Map<String, Object>> getUserGrowth(
            @RequestParam(defaultValue = "12") int months,
            Authentication authentication) {
        LocalDate now = LocalDate.now();
        LocalDateTime startDateTime = now.minusMonths(months - 1).withDayOfMonth(1).atStartOfDay();

        List<com.ai.dashboard.entity.User> users = userRepository.findAll(
                org.springframework.data.jpa.domain.Specification.where(
                        (root, query, cb) -> {
                            if (root.get("createdAt") == null) return null;
                            return cb.greaterThanOrEqualTo(root.get("createdAt"), startDateTime);
                        }
                )
        );

        Map<Integer, Long> countsByMonth = new HashMap<>();
        for (int i = 0; i < 12; i++) {
            countsByMonth.put(i, 0L);
        }

        for (com.ai.dashboard.entity.User user : users) {
            java.time.LocalDateTime createdAt = user.getCreatedAt();
            if (createdAt != null) {
                int monthIndex = 11 - (int) ChronoUnit.MONTHS.between(
                        createdAt.toLocalDate().withDayOfMonth(1),
                        now.withDayOfMonth(1)
                );
                if (monthIndex >= 0 && monthIndex < 12) {
                    countsByMonth.merge(monthIndex, 1L, Long::sum);
                }
            }
        }

        List<String> labels = new ArrayList<>();
        List<Long> values = new ArrayList<>();

        for (int i = months - 1; i >= 0; i--) {
            LocalDate month = now.minusMonths(i).withDayOfMonth(1);
            String label = month.getMonth().name().substring(0, 3) + " " + month.getYear();
            labels.add(label);
            int monthIndex = 11 - i;
            values.add(monthIndex < 12 ? countsByMonth.getOrDefault(monthIndex, 0L) : 0L);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("values", values);
        return ApiResponse.success(response);
    }

    // ------------------------------------------------------------------

    private Long extractUserId(Authentication authentication) {
        Object details = authentication.getDetails();
        if (details instanceof Long longId) {
            return longId;
        }
        return null;
    }

    private String getCurrentUserRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("ROLE_STUDENT");
    }
}