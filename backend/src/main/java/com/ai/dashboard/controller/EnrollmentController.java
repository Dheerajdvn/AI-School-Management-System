package com.ai.dashboard.controller;

import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.EnrollmentRequest;
import com.ai.dashboard.dto.EnrollmentResponse;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Enrollment management REST endpoints.
 *
 * <p>Access control:
 * <ul>
 *   <li>ADMIN: Full access</li>
 *   <li>TEACHER: Manage enrollments for own courses only</li>
 *   <li>STUDENT: View their own enrollments, manage their own enrollments</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
@Tag(name = "Enrollments", description = "Student enrollment management APIs")
public class EnrollmentController {

    private static final List<String> SORTABLE = List.of(
            "id", "enrollmentDate", "status", "progress");

    private final EnrollmentService enrollmentService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_STUDENT')")
    @Operation(summary = "Enroll a student in a course (ADMIN/SUPER_ADMIN only, or STUDENT for themselves)")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enroll(
            @Valid @RequestBody EnrollmentRequest request,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Enrollment created",
                        enrollmentService.enrollStudent(request, currentUserId, currentUserRole)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Remove enrollment (ADMIN/SUPER_ADMIN/TEACHER for own courses/STUDENT for own enrollments)")
    public ApiResponse<Void> remove(
            @PathVariable Long id,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        enrollmentService.removeEnrollment(id, currentUserId, currentUserRole);
        return ApiResponse.success("Enrollment removed", null);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get student enrollments")
    public ApiResponse<PagedResponse<EnrollmentResponse>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(enrollmentService.getStudentEnrollments(
                studentId, PageRequest.of(page, size, sort), currentUserId, currentUserRole));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Get enrollments for a course (ADMIN/SUPER_ADMIN/TEACHER for own courses)")
    public ApiResponse<PagedResponse<EnrollmentResponse>> getByCourse(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(enrollmentService.getCourseStudents(
                courseId, PageRequest.of(page, size, sort), currentUserId, currentUserRole));
    }

    @PutMapping("/{id}/progress")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Update enrollment progress")
    public ApiResponse<EnrollmentResponse> updateProgress(
            @PathVariable Long id,
            @RequestParam @Min(0) @Max(100) Integer progress,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success("Progress updated",
                enrollmentService.updateProgress(id, progress, currentUserId, currentUserRole));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Complete enrollment (sets progress to 100)")
    public ApiResponse<EnrollmentResponse> complete(
            @PathVariable Long id,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success("Course completed",
                enrollmentService.completeCourse(id, currentUserId, currentUserRole));
    }


    private Long extractUserId(Authentication authentication) {
        if (authentication == null) return null;
        Object credentials = authentication.getCredentials();
        if (credentials instanceof Long) {
            return (Long) credentials;
        }
        Object details = authentication.getDetails();
        if (details instanceof Long) {
            return (Long) details;
        }
        return null;
    }

    private String getCurrentUserRole(Authentication authentication) {
        if (authentication == null) return "ROLE_STUDENT";
        var authorities = authentication.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .collect(java.util.stream.Collectors.toSet());
        if (authorities.contains("ROLE_SUPER_ADMIN") || authorities.contains("ROLE_ADMIN")) {
            return "ROLE_ADMIN";
        }
        if (authorities.contains("ROLE_PRINCIPAL")) {
            return "ROLE_PRINCIPAL";
        }
        if (authorities.contains("ROLE_SCHOOL_ADMIN")) {
            return "ROLE_SCHOOL_ADMIN";
        }
        if (authorities.contains("ROLE_TEACHER")) {
            return "ROLE_TEACHER";
        }
        return "ROLE_STUDENT";
    }

    private Sort buildSort(String sortBy, String direction) {
        String field = sortBy;
        if (!SORTABLE.contains(field)) {
            field = "id";
        }
        Sort.Direction dir = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        return Sort.by(dir, field);
    }
}