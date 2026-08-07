package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.GradeRequest;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.dto.SubmissionRequest;
import com.ai.dashboard.dto.SubmissionResponse;
import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Submission;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.*;
import com.ai.dashboard.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Default implementation of {@link SubmissionService}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional
    public SubmissionResponse submitAssignment(Long assignmentId, SubmissionRequest request, Long currentUserId, String currentUserRole) {
        log.debug("Submitting assignment id={} by student id={}", assignmentId, currentUserId);

        validateStudentRole(currentUserRole);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id " + assignmentId));

        validateAssignmentCanReceiveSubmissions(assignment);

        // Check if student is enrolled in the course
        boolean isEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(
                currentUserId, assignment.getCourse().getId());
        if (!isEnrolled) {
            throw new AccessDeniedException("You are not enrolled in this course");
        }

        // Check for duplicate submission
        User student = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + currentUserId));

        if (submissionRepository.existsByAssignmentAndStudent(assignment, student)) {
            throw new BadRequestException("You have already submitted this assignment");
        }

        Submission.Status status = determineStatus(assignment.getDueDate());

        Submission submission = Submission.builder()
                .assignment(assignment)
                .student(student)
                .submissionText(request.getSubmissionText())
                .attachmentUrl(request.getAttachmentUrl())
                .status(status)
                .build();

        Submission saved = submissionRepository.save(submission);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public SubmissionResponse updateSubmission(Long id, SubmissionRequest request, Long currentUserId, String currentUserRole) {
        log.debug("Updating submission id={}", id);

        validateStudentRole(currentUserRole);

        Submission existing = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + id));

        validateOwnership(existing, currentUserId, currentUserRole);

        // Only allow updates for DRAFT or SUBMITTED/LATE status before due date
        if (existing.getStatus() == Submission.Status.GRADED) {
            throw new BadRequestException("Graded submissions cannot be updated");
        }

        existing.setSubmissionText(request.getSubmissionText());
        existing.setAttachmentUrl(request.getAttachmentUrl());

        Submission saved = submissionRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteSubmission(Long id, Long currentUserId, String currentUserRole) {
        log.debug("Deleting submission id={}", id);

        validateStudentRole(currentUserRole);

        Submission existing = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + id));

        validateOwnership(existing, currentUserId, currentUserRole);

        if (existing.getStatus() == Submission.Status.GRADED) {
            throw new BadRequestException("Graded submissions cannot be deleted");
        }

        submissionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public SubmissionResponse getSubmission(Long id, Long currentUserId, String currentUserRole) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + id));

        validateReadAccess(submission, currentUserId, currentUserRole);

        return toResponse(submission);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<SubmissionResponse> getStudentSubmissions(Long studentId, Pageable pageable, Long currentUserId, String currentUserRole) {
        validateStudentReadAccess(studentId, currentUserId, currentUserRole);

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + studentId));

        Page<Submission> result = submissionRepository.findByStudent(student, pageable);
        return toPaged(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<SubmissionResponse> getAssignmentSubmissions(Long assignmentId, Pageable pageable, Long currentUserId, String currentUserRole) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id " + assignmentId));

        validateTeacherOrAdminAccess(assignment, currentUserId, currentUserRole);

        Page<Submission> result = submissionRepository.findByAssignment(assignment, pageable);
        return toPaged(result);
    }

    @Override
    @Transactional
    public SubmissionResponse gradeSubmission(Long id, GradeRequest request, Long currentUserId, String currentUserRole) {
        log.debug("Grading submission id={}", id);

        validateTeacherOrAdminRole(currentUserRole);

        Submission existing = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + id));

        validateTeacherOrAdminAccess(existing.getAssignment(), currentUserId, currentUserRole);

        validateMarks(existing, request.getObtainedMarks());

        User teacher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id " + currentUserId));

        existing.setObtainedMarks(request.getObtainedMarks());
        existing.setFeedback(request.getFeedback());
        existing.setPrivateNotes(request.getPrivateNotes());
        existing.setGradedAt(LocalDateTime.now());
        existing.setGradedBy(teacher);
        existing.setStatus(Submission.Status.GRADED);

        Submission saved = submissionRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<SubmissionResponse> searchSubmissions(
            Long assignmentId,
            Long studentId,
            String status,
            Boolean graded,
            Pageable pageable,
            Long currentUserId,
            String currentUserRole) {

        Specification<Submission> spec = Specification
                .allOf(
                        SubmissionSpecifications.hasAssignmentId(assignmentId),
                        SubmissionSpecifications.hasStudentId(studentId),
                        SubmissionSpecifications.hasStatus(status),
                        SubmissionSpecifications.hasGraded(graded));

        if ("ROLE_STUDENT".equals(currentUserRole)) {
            spec = spec.and(SubmissionSpecifications.hasStudentId(currentUserId));
        }

        Page<Submission> result = submissionRepository.findAll(spec, pageable);
        return toPaged(result);
    }


    private void validateStudentRole(String currentUserRole) {
        if (!"ROLE_STUDENT".equals(currentUserRole) && !"ROLE_ADMIN".equals(currentUserRole)) {
            throw new AccessDeniedException("Only students can submit assignments");
        }
    }

    private void validateTeacherOrAdminRole(String currentUserRole) {
        if ("ROLE_STUDENT".equals(currentUserRole)) {
            throw new AccessDeniedException("Students cannot grade submissions");
        }
    }

    private void validateAssignmentCanReceiveSubmissions(Assignment assignment) {
        if (assignment.getStatus() != Assignment.Status.PUBLISHED) {
            throw new BadRequestException("Only published assignments can receive submissions");
        }
    }

    private void validateMarks(Submission submission, Integer obtainedMarks) {
        if (obtainedMarks != null && submission.getAssignment() != null) {
            Integer maxMarks = submission.getAssignment().getMaxMarks();
            if (maxMarks != null && obtainedMarks > maxMarks) {
                throw new BadRequestException("Obtained marks cannot exceed max marks: " + maxMarks);
            }
        }
    }

    private void validateOwnership(Submission submission, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }
        if (!submission.getStudent().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You can only manage your own submissions");
        }
    }

    private void validateReadAccess(Submission submission, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }
        if ("ROLE_TEACHER".equals(currentUserRole)) {
            validateTeacherOrAdminAccess(submission.getAssignment(), currentUserId, currentUserRole);
        }
        if ("ROLE_STUDENT".equals(currentUserRole)) {
            if (!submission.getStudent().getId().equals(currentUserId)) {
                throw new AccessDeniedException("You can only view your own submissions");
            }
        }
    }

    private void validateStudentReadAccess(Long studentId, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }
        if ("ROLE_TEACHER".equals(currentUserRole)) {
            // Teacher can view all students' submissions
            return;
        }
        if (!studentId.equals(currentUserId)) {
            throw new AccessDeniedException("You can only view your own submissions");
        }
    }

    private void validateTeacherOrAdminAccess(Assignment assignment, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }
        if (!assignment.getCourse().getTeacher().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You can only manage submissions for your own courses");
        }
    }

    private Submission.Status determineStatus(LocalDateTime dueDate) {
        if (dueDate == null || dueDate.isAfter(LocalDateTime.now())) {
            return Submission.Status.SUBMITTED;
        }
        return Submission.Status.LATE;
    }

    private SubmissionResponse toResponse(Submission submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignment().getId())
                .assignmentTitle(submission.getAssignment().getTitle())
                .assignmentCode(submission.getAssignment().getCourse().getCourseCode())
                .studentId(submission.getStudent().getId())
                .studentName(submission.getStudent().getUsername())
                .submittedAt(submission.getSubmittedAt())
                .updatedAt(submission.getUpdatedAt())
                .status(submission.getStatus().name())
                .submissionText(submission.getSubmissionText())
                .attachmentUrl(submission.getAttachmentUrl())
                .obtainedMarks(submission.getObtainedMarks())
                .feedback(submission.getFeedback())
                .gradedAt(submission.getGradedAt())
                .gradedById(submission.getGradedBy() != null ? submission.getGradedBy().getId() : null)
                .gradedByName(submission.getGradedBy() != null ? submission.getGradedBy().getUsername() : null)
                .build();
    }

    private PagedResponse<SubmissionResponse> toPaged(Page<Submission> result) {
        return PagedResponse.<SubmissionResponse>builder()
                .content(result.getContent().stream().map(this::toResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }
}