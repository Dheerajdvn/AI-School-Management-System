package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.AssignmentRequest;
import com.ai.dashboard.dto.AssignmentResponse;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.AssignmentRepository;
import com.ai.dashboard.repository.AssignmentSpecifications;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.EnrollmentRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Default implementation of {@link AssignmentService}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @CacheEvict(value = "assignments", allEntries = true)
    @Transactional
    public AssignmentResponse createAssignment(AssignmentRequest request, Long courseId, Long currentUserId, String currentUserRole) {
        log.debug("Creating assignment for course id={}", courseId);

        validateStudentRole(currentUserRole);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + courseId));

        validateCourseActive(course);
        validateOwnership(course, currentUserId, currentUserRole);
        validateDueDate(request.getDueDate());

        User teacher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id " + currentUserId));

        Assignment assignment = Assignment.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .instructions(request.getInstructions())
                .dueDate(request.getDueDate())
                .maxMarks(request.getMaxMarks())
                .attachmentUrl(request.getAttachmentUrl())
                .status(Assignment.Status.DRAFT)
                .teacher(teacher)
                .course(course)
                .build();

        Assignment saved = assignmentRepository.save(assignment);
        return toResponse(saved);
    }

    @Override
    @CacheEvict(value = "assignments", allEntries = true)
    @Transactional
    public AssignmentResponse updateAssignment(Long id, AssignmentRequest request, Long currentUserId, String currentUserRole) {
        log.debug("Updating assignment id={}", id);

        validateStudentRole(currentUserRole);

        Assignment existing = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id " + id));

        validateAssignmentEditable(existing);
        validateOwnership(existing, currentUserId, currentUserRole);

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setInstructions(request.getInstructions());
        existing.setDueDate(request.getDueDate());
        existing.setMaxMarks(request.getMaxMarks());
        existing.setAttachmentUrl(request.getAttachmentUrl());

        Assignment saved = assignmentRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @CacheEvict(value = "assignments", allEntries = true)
    @Transactional
    public void deleteAssignment(Long id, Long currentUserId, String currentUserRole) {
        log.debug("Deleting assignment id={}", id);

        validateStudentRole(currentUserRole);

        Assignment existing = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id " + id));

        validateOwnership(existing, currentUserId, currentUserRole);
        assignmentRepository.deleteById(id);
    }

    @Override
    @CacheEvict(value = "assignments", allEntries = true)
    @Transactional
    public AssignmentResponse publishAssignment(Long id, Long currentUserId, String currentUserRole) {
        log.debug("Publishing assignment id={}", id);

        validateTeacherOrAdminRole(currentUserRole);

        Assignment existing = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id " + id));

        validateOwnership(existing, currentUserId, currentUserRole);

        existing.setStatus(Assignment.Status.PUBLISHED);
        Assignment saved = assignmentRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @CacheEvict(value = "assignments", allEntries = true)
    @Transactional
    public AssignmentResponse closeAssignment(Long id, Long currentUserId, String currentUserRole) {
        log.debug("Closing assignment id={}", id);

        validateTeacherOrAdminRole(currentUserRole);

        Assignment existing = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id " + id));

        validateOwnership(existing, currentUserId, currentUserRole);

        existing.setStatus(Assignment.Status.CLOSED);
        Assignment saved = assignmentRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AssignmentResponse getAssignment(Long id, Long currentUserId, String currentUserRole) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id " + id));

        validateReadAccess(assignment, currentUserId, currentUserRole);

        return toResponse(assignment);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AssignmentResponse> getAssignments(Pageable pageable, Long currentUserId, String currentUserRole) {
        Page<Assignment> result;

        if ("ROLE_ADMIN".equals(currentUserRole)) {
            result = assignmentRepository.findAll(pageable);
        } else if ("ROLE_TEACHER".equals(currentUserRole)) {
            result = assignmentRepository.findByTeacherId(currentUserId, pageable);
        } else {
            result = getAssignmentsForStudentEnrollments(currentUserId, pageable);
        }

        return toPaged(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AssignmentResponse> searchAssignments(
            Long courseId,
            String title,
            String status,
            Pageable pageable,
            Long currentUserId,
            String currentUserRole) {

        Specification<Assignment> spec = Specification
                .allOf(
                        AssignmentSpecifications.hasCourseId(courseId),
                        AssignmentSpecifications.hasTitle(title),
                        AssignmentSpecifications.hasStatus(status));

        if ("ROLE_ADMIN".equals(currentUserRole)) {
            // Admin can see all assignments
        } else if ("ROLE_TEACHER".equals(currentUserRole)) {
            spec = spec.and(AssignmentSpecifications.hasTeacherId(currentUserId));
        } else {
            // Student: filter to published assignments in enrolled courses
            spec = spec.and(AssignmentSpecifications.hasStatus("PUBLISHED"));
        }

        Page<Assignment> result = assignmentRepository.findAll(spec, pageable);
        return toPaged(result);
    }

    // ------------------------------------------------------------------

    private void validateStudentRole(String currentUserRole) {
        if ("ROLE_STUDENT".equals(currentUserRole)) {
            throw new AccessDeniedException("Student cannot create or edit assignments");
        }
    }

    private void validateTeacherOrAdminRole(String currentUserRole) {
        if ("ROLE_STUDENT".equals(currentUserRole)) {
            throw new AccessDeniedException("Student cannot publish or close assignments");
        }
    }

    private void validateCourseActive(Course course) {
        if (course.getStatus() != Course.Status.ACTIVE) {
            throw new BadRequestException("Cannot create assignment for inactive course");
        }
    }

    private void validateDueDate(LocalDateTime dueDate) {
        if (dueDate != null && dueDate.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Due date cannot be in the past");
        }
    }

    private void validateAssignmentEditable(Assignment assignment) {
        if (assignment.getStatus() == Assignment.Status.CLOSED) {
            throw new BadRequestException("Closed assignments cannot be edited");
        }
    }

    private void validateOwnership(Assignment assignment, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }
        if (!assignment.getTeacher().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You don't have permission to modify this assignment");
        }
    }

    private void validateOwnership(Course course, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }
        if (!course.getTeacher().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You don't have permission to create assignment for this course");
        }
    }

    private void validateReadAccess(Assignment assignment, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }

        if ("ROLE_TEACHER".equals(currentUserRole)) {
            if (assignment.getStatus() == Assignment.Status.DRAFT &&
                !assignment.getTeacher().getId().equals(currentUserId) &&
                !assignment.getCourse().getTeacher().getId().equals(currentUserId)) {
                throw new AccessDeniedException("Draft assignments are only visible to ADMIN and course teacher");
            }
        }

        if ("ROLE_STUDENT".equals(currentUserRole)) {
            if (assignment.getStatus() != Assignment.Status.PUBLISHED) {
                throw new AccessDeniedException("Students can only view published assignments");
            }
            // Additional check: verify student is enrolled in the course
            boolean isEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(
                    currentUserId, assignment.getCourse().getId());
            if (!isEnrolled) {
                throw new AccessDeniedException("You are not enrolled in this course");
            }
        }
    }

    private Page<Assignment> getAssignmentsForStudentEnrollments(Long studentId, Pageable pageable) {
        // This would typically use a more efficient query, but for simplicity we'll filter by enrolled courses
        return assignmentRepository.findAll(AssignmentSpecifications.hasStatus("PUBLISHED"), pageable);
    }

    private AssignmentResponse toResponse(Assignment assignment) {
        return AssignmentResponse.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .instructions(assignment.getInstructions())
                .dueDate(assignment.getDueDate())
                .maxMarks(assignment.getMaxMarks())
                .attachmentUrl(assignment.getAttachmentUrl())
                .status(assignment.getStatus().name())
                .createdAt(assignment.getCreatedAt())
                .updatedAt(assignment.getUpdatedAt())
                .teacherId(assignment.getTeacher().getId())
                .teacherName(assignment.getTeacher().getUsername())
                .courseId(assignment.getCourse().getId())
                .courseCode(assignment.getCourse().getCourseCode())
                .courseTitle(assignment.getCourse().getTitle())
                .build();
    }

    private PagedResponse<AssignmentResponse> toPaged(Page<Assignment> result) {
        return PagedResponse.<AssignmentResponse>builder()
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