package com.ai.dashboard.service;

import com.ai.dashboard.dto.GradeRequest;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.dto.SubmissionRequest;
import com.ai.dashboard.dto.SubmissionResponse;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for submission management.
 */
public interface SubmissionService {

    /**
     * Submit an assignment.
     */
    SubmissionResponse submitAssignment(Long assignmentId, SubmissionRequest request, Long currentUserId, String currentUserRole);

    /**
     * Update a submission.
     */
    SubmissionResponse updateSubmission(Long id, SubmissionRequest request, Long currentUserId, String currentUserRole);

    /**
     * Delete a submission.
     */
    void deleteSubmission(Long id, Long currentUserId, String currentUserRole);

    /**
     * Get a submission by ID.
     */
    SubmissionResponse getSubmission(Long id, Long currentUserId, String currentUserRole);

    /**
     * Get all submissions for a student.
     */
    PagedResponse<SubmissionResponse> getStudentSubmissions(Long studentId, Pageable pageable, Long currentUserId, String currentUserRole);

    /**
     * Get all submissions for an assignment.
     */
    PagedResponse<SubmissionResponse> getAssignmentSubmissions(Long assignmentId, Pageable pageable, Long currentUserId, String currentUserRole);

    /**
     * Grade a submission.
     */
    SubmissionResponse gradeSubmission(Long id, GradeRequest request, Long currentUserId, String currentUserRole);

    /**
     * Search submissions with filters.
     */
    PagedResponse<SubmissionResponse> searchSubmissions(
            Long assignmentId,
            Long studentId,
            String status,
            Boolean graded,
            Pageable pageable,
            Long currentUserId,
            String currentUserRole);
}