package com.ai.dashboard.service;

import com.ai.dashboard.dto.CourseRequest;
import com.ai.dashboard.dto.CourseResponse;
import com.ai.dashboard.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for course management.
 */
public interface CourseService {

    /**
     * Create a new course.
     */
    CourseResponse createCourse(CourseRequest request, Long currentUserId, String currentUserRole);

    /**
     * Update an existing course.
     */
    CourseResponse updateCourse(Long id, CourseRequest request, Long currentUserId, String currentUserRole);

    /**
     * Delete a course.
     */
    void deleteCourse(Long id, Long currentUserId, String currentUserRole);

    /**
     * Get a course by ID.
     */
    CourseResponse getCourseById(Long id, String currentUserRole);

    /**
     * Get all courses with pagination and sorting.
     */
    PagedResponse<CourseResponse> getAllCourses(Pageable pageable, String currentUserRole, Long currentUserId);

    /**
     * Search courses with filtering.
     */
    PagedResponse<CourseResponse> searchCourses(
            String courseCode,
            String title,
            String status,
            Long teacherId,
            Pageable pageable,
            String currentUserRole,
            Long currentUserId);
}