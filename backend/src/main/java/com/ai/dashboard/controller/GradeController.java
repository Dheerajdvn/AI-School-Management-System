package com.ai.dashboard.controller;

import com.ai.dashboard.dto.*;
import com.ai.dashboard.service.GradeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Grading REST endpoints.
 *
 * <p>Access control:
 * <ul>
 *   <li>ADMIN: Full access</li>
 *   <li>TEACHER: Grade only their own course submissions</li>
 *   <li>STUDENT: Read only their own published grades</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/grades")
@RequiredArgsConstructor
@Tag(name = "Grades", description = "Grading and feedback APIs")
public class GradeController {

    private static final List<String> SORTABLE = List.of(
            "id", "submittedAt", "gradedAt", "obtainedMarks", "percentage");

    private final GradeService gradeService;

    @PutMapping("/{submissionId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Grade a submission (ADMIN/TEACHER - own courses only)")
    public ApiResponse<GradeResponse> grade(
            @PathVariable Long submissionId,
            @Valid @RequestBody GradeRequest request,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success("Submission graded",
                gradeService.gradeSubmission(submissionId, request, currentUserId, currentUserRole));
    }

    @PutMapping("/{submissionId}/publish")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Publish a grade (ADMIN/TEACHER - own courses only)")
    public ApiResponse<GradeResponse> publish(
            @PathVariable Long submissionId,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success("Grade published",
                gradeService.publishGrade(submissionId, currentUserId, currentUserRole));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get all grades for a student")
    public ApiResponse<PagedResponse<GradeResponse>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(gradeService.getStudentGrades(
                studentId, PageRequest.of(page, size, sort), currentUserId, currentUserRole));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Get all grades for a course (ADMIN/TEACHER - own courses only)")
    public ApiResponse<PagedResponse<GradeResponse>> getByCourse(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(gradeService.getCourseGrades(
                courseId, PageRequest.of(page, size, sort), currentUserId, currentUserRole));
    }

    @GetMapping("/history/{submissionId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Get grade history for a submission (ADMIN/TEACHER - own courses only)")
    public ApiResponse<PagedResponse<GradeHistoryResponse>> getHistory(
            @PathVariable Long submissionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success(gradeService.getGradeHistory(
                submissionId, PageRequest.of(page, size), currentUserId, currentUserRole));
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Get grade statistics (ADMIN/TEACHER - own courses only)")
    public ApiResponse<GradeStatistics> getStatistics(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long assignmentId,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        if (courseId == null && assignmentId == null) {
            return ApiResponse.error("Either courseId or assignmentId must be provided");
        }

        return ApiResponse.success(gradeService.getStatistics(
                courseId, assignmentId, currentUserId, currentUserRole));
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