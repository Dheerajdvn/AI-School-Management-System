package com.ai.dashboard.controller;

import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.AssignmentRequest;
import com.ai.dashboard.dto.AssignmentResponse;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.service.AssignmentService;
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
 * Assignment management REST endpoints.
 *
 * <p>Access control:
 * <ul>
 *   <li>ADMIN: Full access</li>
 *   <li>TEACHER: Create, update, delete assignments for own courses; publish/close own assignments</li>
 *   <li>STUDENT: View published assignments for enrolled courses only</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
@Tag(name = "Assignments", description = "Assignment management APIs")
public class AssignmentController {

    private static final List<String> SORTABLE = List.of(
            "id", "title", "dueDate", "maxMarks", "status", "createdAt", "updatedAt");

    private final AssignmentService assignmentService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Create a new assignment (ADMIN/TEACHER - own courses only)")
    public ResponseEntity<ApiResponse<AssignmentResponse>> create(
            @RequestParam(required = false) Long courseId,
            @Valid @RequestBody AssignmentRequest request,
            Authentication authentication) {

        Long targetCourseId = courseId != null ? courseId : request.getCourseId();
        if (targetCourseId == null) {
            throw new IllegalArgumentException("Course ID is required");
        }

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment created",
                        assignmentService.createAssignment(request, targetCourseId, currentUserId, currentUserRole)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Update an assignment (ADMIN/TEACHER - own courses only)")
    public ApiResponse<AssignmentResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentRequest request,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success("Assignment updated",
                assignmentService.updateAssignment(id, request, currentUserId, currentUserRole));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Delete an assignment (ADMIN/TEACHER - own courses only)")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        assignmentService.deleteAssignment(id, currentUserId, currentUserRole);
        return ApiResponse.success("Assignment deleted", null);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get an assignment by ID")
    public ApiResponse<AssignmentResponse> getById(
            @PathVariable Long id,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success(assignmentService.getAssignment(id, currentUserId, currentUserRole));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get all assignments")
    public ApiResponse<PagedResponse<AssignmentResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(assignmentService.getAssignments(
                PageRequest.of(page, size, sort), currentUserId, currentUserRole));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Search assignments")
    public ApiResponse<PagedResponse<AssignmentResponse>> search(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(assignmentService.searchAssignments(
                courseId, title, status,
                PageRequest.of(page, size, sort),
                currentUserId, currentUserRole));
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Publish an assignment (ADMIN/TEACHER - own courses only)")
    public ApiResponse<AssignmentResponse> publish(
            @PathVariable Long id,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success("Assignment published",
                assignmentService.publishAssignment(id, currentUserId, currentUserRole));
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Close an assignment (ADMIN/TEACHER - own courses only)")
    public ApiResponse<AssignmentResponse> close(
            @PathVariable Long id,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success("Assignment closed",
                assignmentService.closeAssignment(id, currentUserId, currentUserRole));
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
