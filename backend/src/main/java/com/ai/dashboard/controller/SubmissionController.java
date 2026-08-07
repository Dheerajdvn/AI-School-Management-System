package com.ai.dashboard.controller;

import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.GradeRequest;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.dto.SubmissionRequest;
import com.ai.dashboard.dto.SubmissionResponse;
import com.ai.dashboard.service.SubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
 * Submission management REST endpoints.
 *
 * <p>Access control:
 * <ul>
 *   <li>ADMIN: Full access</li>
 *   <li>TEACHER: View and grade submissions for own courses</li>
 *   <li>STUDENT: Submit/update own submissions; view own submissions only</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
@Tag(name = "Submissions", description = "Submission management APIs")
public class SubmissionController {

    private static final List<String> SORTABLE = List.of(
            "id", "submittedAt", "updatedAt", "status", "obtainedMarks");

    private final SubmissionService submissionService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    @Operation(summary = "Submit an assignment (ADMIN/STUDENT)")
    public ResponseEntity<ApiResponse<SubmissionResponse>> submit(
            @RequestParam Long assignmentId,
            @Valid @RequestBody SubmissionRequest request,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Submission created",
                        submissionService.submitAssignment(assignmentId, request, currentUserId, currentUserRole)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    @Operation(summary = "Update a submission (ADMIN/STUDENT - own submissions only)")
    public ApiResponse<SubmissionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SubmissionRequest request,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success("Submission updated",
                submissionService.updateSubmission(id, request, currentUserId, currentUserRole));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    @Operation(summary = "Delete a submission (ADMIN/STUDENT - own submissions only)")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        submissionService.deleteSubmission(id, currentUserId, currentUserRole);
        return ApiResponse.success("Submission deleted", null);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get a submission by ID")
    public ApiResponse<SubmissionResponse> getById(
            @PathVariable Long id,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success(submissionService.getSubmission(id, currentUserId, currentUserRole));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get all submissions for a student")
    public ApiResponse<PagedResponse<SubmissionResponse>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(submissionService.getStudentSubmissions(
                studentId, PageRequest.of(page, size, sort), currentUserId, currentUserRole));
    }

    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Get all submissions for an assignment (ADMIN/TEACHER - own courses only)")
    public ApiResponse<PagedResponse<SubmissionResponse>> getByAssignment(
            @PathVariable Long assignmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(submissionService.getAssignmentSubmissions(
                assignmentId, PageRequest.of(page, size, sort), currentUserId, currentUserRole));
    }

    @PutMapping("/{id}/grade")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Grade a submission (ADMIN/TEACHER - own courses only)")
    public ApiResponse<SubmissionResponse> grade(
            @PathVariable Long id,
            @Valid @RequestBody GradeRequest request,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success("Submission graded",
                submissionService.gradeSubmission(id, request, currentUserId, currentUserRole));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Search submissions")
    public ApiResponse<PagedResponse<SubmissionResponse>> search(
            @RequestParam(required = false) Long assignmentId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean graded,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(submissionService.searchSubmissions(
                assignmentId, studentId, status, graded,
                PageRequest.of(page, size, sort),
                currentUserId, currentUserRole));
    }


    private Long extractUserId(Authentication authentication) {
        if (authentication == null) {
            return null;
        }
        Object credentials = authentication.getCredentials();
        return credentials instanceof Long ? (Long) credentials : null;
    }

    private String getCurrentUserRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("ROLE_STUDENT");
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