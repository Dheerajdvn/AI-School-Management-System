package com.ai.dashboard.service;

import com.ai.dashboard.dto.AssignmentRequest;
import com.ai.dashboard.dto.AssignmentResponse;
import com.ai.dashboard.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for assignment management.
 */
public interface AssignmentService {

    /**
     * Create a new assignment.
     */
    AssignmentResponse createAssignment(AssignmentRequest request, Long courseId, Long currentUserId, String currentUserRole);

    /**
     * Update an existing assignment.
     */
    AssignmentResponse updateAssignment(Long id, AssignmentRequest request, Long currentUserId, String currentUserRole);

    /**
     * Delete an assignment.
     */
    void deleteAssignment(Long id, Long currentUserId, String currentUserRole);

    /**
     * Publish an assignment.
     */
    AssignmentResponse publishAssignment(Long id, Long currentUserId, String currentUserRole);

    /**
     * Close an assignment.
     */
    AssignmentResponse closeAssignment(Long id, Long currentUserId, String currentUserRole);

    /**
     * Get an assignment by ID.
     */
    AssignmentResponse getAssignment(Long id, Long currentUserId, String currentUserRole);

    /**
     * Get all assignments with pagination.
     */
    PagedResponse<AssignmentResponse> getAssignments(Pageable pageable, Long currentUserId, String currentUserRole);

    /**
     * Search assignments with filters.
     */
    PagedResponse<AssignmentResponse> searchAssignments(
            Long courseId,
            String title,
            String status,
            Pageable pageable,
            Long currentUserId,
            String currentUserRole);
}