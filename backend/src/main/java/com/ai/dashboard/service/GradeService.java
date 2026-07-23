package com.ai.dashboard.service;

import com.ai.dashboard.dto.GradeHistoryResponse;
import com.ai.dashboard.dto.GradeRequest;
import com.ai.dashboard.dto.GradeResponse;
import com.ai.dashboard.dto.GradeStatistics;
import com.ai.dashboard.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for grading management.
 */
public interface GradeService {

    /**
     * Grade a submission.
     */
    GradeResponse gradeSubmission(Long submissionId, GradeRequest request, Long currentUserId, String currentUserRole);

    /**
     * Update an existing grade.
     */
    GradeResponse updateGrade(Long submissionId, GradeRequest request, Long currentUserId, String currentUserRole);

    /**
     * Publish a grade (makes it visible to student).
     */
    GradeResponse publishGrade(Long submissionId, Long currentUserId, String currentUserRole);

    /**
     * Get all grades for a student.
     */
    PagedResponse<GradeResponse> getStudentGrades(Long studentId, Pageable pageable, Long currentUserId, String currentUserRole);

    /**
     * Get all grades for a course.
     */
    PagedResponse<GradeResponse> getCourseGrades(Long courseId, Pageable pageable, Long currentUserId, String currentUserRole);

    /**
     * Get grade history for a submission.
     */
    PagedResponse<GradeHistoryResponse> getGradeHistory(Long submissionId, Pageable pageable, Long currentUserId, String currentUserRole);

    /**
     * Get grade statistics for a course or assignment.
     */
    GradeStatistics getStatistics(Long courseId, Long assignmentId, Long currentUserId, String currentUserRole);
}