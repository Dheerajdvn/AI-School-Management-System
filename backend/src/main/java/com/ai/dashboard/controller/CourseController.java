package com.ai.dashboard.controller;

import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.CourseRequest;
import com.ai.dashboard.dto.CourseResponse;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.security.JwtService;
import com.ai.dashboard.service.CourseService;
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
 * Course management REST endpoints.
 *
 * <p>Access control:
 * <ul>
 *   <li>ADMIN: Full access to all courses</li>
 *   <li>TEACHER: Create, update, delete own courses; view own courses</li>
 *   <li>STUDENT: View only ACTIVE courses</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Course management APIs")
public class CourseController {

    private static final List<String> SORTABLE = List.of(
            "id", "courseCode", "title", "status", "createdAt", "updatedAt");

    private final CourseService courseService;
    private final JwtService jwtService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Create a new course (ADMIN/TEACHER only)")
    public ResponseEntity<ApiResponse<CourseResponse>> create(
            @Valid @RequestBody CourseRequest request,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Course created",
                        courseService.createCourse(request, currentUserId, currentUserRole)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Update a course (ADMIN/TEACHER - own courses only)")
    public ApiResponse<CourseResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        return ApiResponse.success("Course updated",
                courseService.updateCourse(id, request, currentUserId, currentUserRole));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Delete a course (ADMIN/TEACHER - own courses only)")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            Authentication authentication) {

        Long currentUserId = extractUserId(authentication);
        String currentUserRole = getCurrentUserRole(authentication);

        courseService.deleteCourse(id, currentUserId, currentUserRole);
        return ApiResponse.success("Course deleted", null);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get a course by ID")
    public ApiResponse<CourseResponse> getById(
            @PathVariable Long id,
            Authentication authentication) {

        String currentUserRole = getCurrentUserRole(authentication);
        return ApiResponse.success(courseService.getCourseById(id, currentUserRole));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get all courses")
    public ApiResponse<PagedResponse<CourseResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        String currentUserRole = getCurrentUserRole(authentication);
        Long currentUserId = extractUserId(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(courseService.getAllCourses(
                PageRequest.of(page, size, sort), currentUserRole, currentUserId));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Search courses")
    public ApiResponse<PagedResponse<CourseResponse>> search(
            @RequestParam(required = false) String courseCode,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long teacherId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        String currentUserRole = getCurrentUserRole(authentication);
        Long currentUserId = extractUserId(authentication);

        Sort sort = buildSort(sortBy, direction);
        return ApiResponse.success(courseService.searchCourses(
                courseCode, title, status, teacherId,
                PageRequest.of(page, size, sort),
                currentUserRole, currentUserId));
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