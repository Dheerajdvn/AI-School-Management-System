package com.ai.dashboard.service;

import com.ai.dashboard.dto.EnrollmentRequest;
import com.ai.dashboard.dto.EnrollmentResponse;
import com.ai.dashboard.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for enrollment management.
 */
public interface EnrollmentService {

    /**
     * Enroll a student in a course.
     */
    EnrollmentResponse enrollStudent(EnrollmentRequest request, Long currentUserId, String currentUserRole);

    /**
     * Remove an enrollment.
     */
    void removeEnrollment(Long id, Long currentUserId, String currentUserRole);

    /**
     * Get enrollments for a student.
     */
    PagedResponse<EnrollmentResponse> getStudentEnrollments(Long studentId, Pageable pageable, Long currentUserId, String currentUserRole);

    /**
     * Get enrollments for a course.
     */
    PagedResponse<EnrollmentResponse> getCourseStudents(Long courseId, Pageable pageable, Long currentUserId, String currentUserRole);

    /**
     * Update enrollment progress.
     */
    EnrollmentResponse updateProgress(Long id, Integer progress, Long currentUserId, String currentUserRole);

    /**
     * Complete a course enrollment.
     */
    EnrollmentResponse completeCourse(Long id, Long currentUserId, String currentUserRole);
}