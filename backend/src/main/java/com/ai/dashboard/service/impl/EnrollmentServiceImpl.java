package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.EnrollmentRequest;
import com.ai.dashboard.dto.EnrollmentResponse;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.Enrollment;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.EnrollmentRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Default implementation of {@link EnrollmentService}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public EnrollmentResponse enrollStudent(EnrollmentRequest request, Long currentUserId, String currentUserRole) {
        log.debug("Enrolling student {} in course {}", request.getStudentId(), request.getCourseId());

        // Validate student
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + request.getStudentId()));

        // Validate course and check status
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + request.getCourseId()));
        
        if (course.getStatus() != Course.Status.ACTIVE) {
            throw new BadRequestException("Cannot enroll in inactive course");
        }

        // Check if student can enroll (TEACHER cannot enroll, STUDENT can only enroll themselves)
        validateEnrollmentPermission(request.getStudentId(), currentUserId, currentUserRole, course);

        // Check for duplicate enrollment
        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new BadRequestException("Student already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrollmentDate(LocalDate.now())
                .status(Enrollment.Status.ENROLLED)
                .progress(0)
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void removeEnrollment(Long id, Long currentUserId, String currentUserRole) {
        log.debug("Removing enrollment id={}", id);

        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id " + id));

        validateOwnership(enrollment, currentUserId, currentUserRole);
        enrollmentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<EnrollmentResponse> getStudentEnrollments(Long studentId, Pageable pageable, Long currentUserId, String currentUserRole) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + studentId));

        // STUDENT can only view their own enrollments
        if ("ROLE_STUDENT".equals(currentUserRole) && !studentId.equals(currentUserId)) {
            throw new AccessDeniedException("You can only view your own enrollments");
        }

        Page<Enrollment> result = enrollmentRepository.findByStudent(student, pageable);
        return toPaged(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<EnrollmentResponse> getCourseStudents(Long courseId, Pageable pageable, Long currentUserId, String currentUserRole) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + courseId));

        // TEACHER can only view enrollments for their own courses
        if (!"ROLE_ADMIN".equals(currentUserRole) && !"ROLE_STUDENT".equals(currentUserRole)) {
            if (!course.getTeacher().getId().equals(currentUserId)) {
                throw new AccessDeniedException("You can only view enrollments for your own courses");
            }
        }

        Page<Enrollment> result = enrollmentRepository.findByCourse(course, pageable);
        return toPaged(result);
    }

    @Override
    @Transactional
    public EnrollmentResponse updateProgress(Long id, Integer progress, Long currentUserId, String currentUserRole) {
        log.debug("Updating progress for enrollment id={}", id);

        if (progress < 0 || progress > 100) {
            throw new BadRequestException("Progress must be between 0 and 100");
        }

        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id " + id));

        validateOwnership(enrollment, currentUserId, currentUserRole);
        enrollment.setProgress(progress);

        Enrollment saved = enrollmentRepository.save(enrollment);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public EnrollmentResponse completeCourse(Long id, Long currentUserId, String currentUserRole) {
        log.debug("Completing enrollment id={}", id);

        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id " + id));

        validateOwnership(enrollment, currentUserId, currentUserRole);
        enrollment.setStatus(Enrollment.Status.COMPLETED);
        enrollment.setProgress(100);

        Enrollment saved = enrollmentRepository.save(enrollment);
        return toResponse(saved);
    }

    // ------------------------------------------------------------------

    private void validateEnrollmentPermission(Long studentId, Long currentUserId, String currentUserRole, Course course) {
        if ("ROLE_STUDENT".equals(currentUserRole)) {
            if (!studentId.equals(currentUserId)) {
                throw new AccessDeniedException("Student can only enroll themselves");
            }
        } else if ("ROLE_TEACHER".equals(currentUserRole)) {
            // TEACHER cannot enroll students
            throw new AccessDeniedException("Teacher cannot enroll students");
        }
        // ADMIN can enroll any student
    }

    private void validateOwnership(Enrollment enrollment, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }
        
        if ("ROLE_TEACHER".equals(currentUserRole)) {
            if (!enrollment.getCourse().getTeacher().getId().equals(currentUserId)) {
                throw new AccessDeniedException("You can only manage enrollments for your own courses");
            }
        } else if ("ROLE_STUDENT".equals(currentUserRole)) {
            if (!enrollment.getStudent().getId().equals(currentUserId)) {
                throw new AccessDeniedException("You can only manage your own enrollments");
            }
        }
    }

    private EnrollmentResponse toResponse(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .studentName(enrollment.getStudent().getUsername())
                .courseId(enrollment.getCourse().getId())
                .courseCode(enrollment.getCourse().getCourseCode())
                .courseTitle(enrollment.getCourse().getTitle())
                .teacherName(enrollment.getCourse().getTeacher().getUsername())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .status(enrollment.getStatus().name())
                .progress(enrollment.getProgress())
                .build();
    }

    private PagedResponse<EnrollmentResponse> toPaged(Page<Enrollment> result) {
        return PagedResponse.<EnrollmentResponse>builder()
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