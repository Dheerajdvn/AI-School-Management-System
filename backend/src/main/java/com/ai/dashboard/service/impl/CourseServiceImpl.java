package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.CourseRequest;
import com.ai.dashboard.dto.CourseResponse;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.CourseSpecifications;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.service.CourseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Default implementation of {@link CourseService}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Override
    @CacheEvict(value = "courses", allEntries = true)
    @Transactional
    public CourseResponse createCourse(CourseRequest request, Long currentUserId, String currentUserRole) {
        log.debug("Creating course: {}", request.getCourseCode());

        validateCourseCodeUnique(request.getCourseCode(), null);

        User teacher = getTeacher(request.getTeacherId(), currentUserRole, currentUserId);

        Course course = Course.builder()
                .courseCode(request.getCourseCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .teacher(teacher)
                .status(parseStatus(request.getStatus()))
                .build();

        Course saved = courseRepository.save(course);
        return toResponse(saved);
    }

    @Override
    @CacheEvict(value = "courses", key = "#id")
    @Transactional
    public CourseResponse updateCourse(Long id, CourseRequest request, Long currentUserId, String currentUserRole) {
        log.debug("Updating course id={}", id);

        Course existing = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + id));

        validateOwnership(existing, currentUserId, currentUserRole);
        validateCourseCodeUnique(request.getCourseCode(), id);

        // Only ADMIN can change teacher
        if (isAdmin(currentUserRole) && request.getTeacherId() != null) {
            User teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id " + request.getTeacherId()));
            existing.setTeacher(teacher);
        }

        existing.setCourseCode(request.getCourseCode());
        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            existing.setStatus(parseStatus(request.getStatus()));
        }

        Course saved = courseRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @CacheEvict(value = "courses", allEntries = true)
    @Transactional
    public void deleteCourse(Long id, Long currentUserId, String currentUserRole) {
        log.debug("Deleting course id={}", id);

        Course existing = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + id));

        validateOwnership(existing, currentUserId, currentUserRole);
        courseRepository.deleteById(id);
    }

    @Override
    @Cacheable(value = "courses", key = "#id")
    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id, String currentUserRole) {
        return courseRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CourseResponse> getAllCourses(Pageable pageable, String currentUserRole, Long currentUserId) {
        Page<Course> result;
        if ("ROLE_STUDENT".equals(currentUserRole)) {
            result = courseRepository.findByStatus(Course.Status.ACTIVE, pageable);
        } else {
            result = courseRepository.findAll(pageable);
        }
        return toPaged(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CourseResponse> searchCourses(
            String courseCode,
            String title,
            String status,
            Long teacherId,
            Pageable pageable,
            String currentUserRole,
            Long currentUserId) {

        Specification<Course> spec = Specification
                .allOf(
                        CourseSpecifications.hasCourseCode(courseCode),
                        CourseSpecifications.hasTitle(title),
                        CourseSpecifications.hasStatus(status));

        // For non-admin users, restrict to own courses
        if (!isAdmin(currentUserRole)) {
            spec = spec.and(CourseSpecifications.hasTeacherId(currentUserId));
        } else if (teacherId != null) {
            spec = spec.and(CourseSpecifications.hasTeacherId(teacherId));
        }

        // For STUDENT, only show ACTIVE courses
        if ("ROLE_STUDENT".equals(currentUserRole)) {
            spec = spec.and(CourseSpecifications.hasStatus("ACTIVE"));
        }

        Page<Course> result = courseRepository.findAll(spec, pageable);
        return toPaged(result);
    }

    // ------------------------------------------------------------------

    private boolean isAdmin(String role) {
        return "ROLE_ADMIN".equals(role) || "ROLE_SUPER_ADMIN".equals(role);
    }

    private User getTeacher(Long teacherId, String currentUserRole, Long currentUserId) {
        if (isAdmin(currentUserRole) && teacherId != null) {
            return userRepository.findById(teacherId)
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id " + teacherId));
        }
        // TEACHER creates course for themselves
        return userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + currentUserId));
    }

    private void validateCourseCodeUnique(String courseCode, Long excludeId) {
        if (courseRepository.existsByCourseCode(courseCode)) {
            Course existing = courseRepository.findByCourseCode(courseCode).orElse(null);
            if (existing == null || !existing.getId().equals(excludeId)) {
                throw new BadRequestException("Course code already exists: " + courseCode);
            }
        }
    }

    private void validateOwnership(Course course, Long currentUserId, String currentUserRole) {
        if (!isAdmin(currentUserRole)) {
            if (!course.getTeacher().getId().equals(currentUserId)) {
                throw new AccessDeniedException("You don't have permission to modify this course");
            }
        }
    }

    private Course.Status parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return Course.Status.ACTIVE;
        }
        try {
            return Course.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }

    private CourseResponse toResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .title(course.getTitle())
                .description(course.getDescription())
                .teacherId(course.getTeacher() != null ? course.getTeacher().getId() : null)
                .teacherName(course.getTeacher() != null ? course.getTeacher().getUsername() : "Unknown")
                .status(course.getStatus() != null ? course.getStatus().name() : "ACTIVE")
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }

    private PagedResponse<CourseResponse> toPaged(Page<Course> result) {
        return PagedResponse.<CourseResponse>builder()
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