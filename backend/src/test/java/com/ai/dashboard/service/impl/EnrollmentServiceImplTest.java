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
import com.ai.dashboard.testutil.TestBuilders;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class EnrollmentServiceImplTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private EnrollmentServiceImpl enrollmentService;

    private User buildStudent(Long id) {
        return TestBuilders.buildUser(id, "student" + id, "student" + id + "@example.com", "ROLE_STUDENT");
    }

    private User buildTeacher(Long id) {
        return TestBuilders.buildUser(id, "teacher" + id, "teacher" + id + "@example.com", "ROLE_TEACHER");
    }

    private Course buildCourse(Long id, User teacher, Course.Status status) {
        return TestBuilders.buildCourse(id, "CS" + id, "Course" + id, "Desc", teacher, status);
    }

    private Enrollment buildEnrollment(Long id, User student, Course course, Enrollment.Status status) {
        return TestBuilders.buildEnrollment(id, student, course, status);
    }

    @Test
    void enrollStudent_success_returnsEnrollmentResponse() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(enrollmentRepository.existsByStudentAndCourse(student, course)).thenReturn(false);
        Enrollment saved = buildEnrollment(1L, student, course, Enrollment.Status.ENROLLED);
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(saved);
        EnrollmentRequest request = TestBuilders.buildEnrollmentRequest(1L, 1L);
        EnrollmentResponse response = enrollmentService.enrollStudent(request, 1L, "ROLE_ADMIN");
        assertEquals(Enrollment.Status.ENROLLED.name(), response.getStatus());
    }

    @Test
    void enrollStudent_studentEnrollingOther_throwsAccessDenied() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        EnrollmentRequest request = TestBuilders.buildEnrollmentRequest(2L, 1L);
        assertThrows(AccessDeniedException.class, () -> enrollmentService.enrollStudent(request, 1L, "ROLE_STUDENT"));
    }

    @Test
    void enrollStudent_teacherRole_throwsAccessDenied() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        EnrollmentRequest request = TestBuilders.buildEnrollmentRequest(1L, 1L);
        assertThrows(AccessDeniedException.class, () -> enrollmentService.enrollStudent(request, 2L, "ROLE_TEACHER"));
    }

    @Test
    void enrollStudent_inactiveCourse_throwsBadRequest() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.INACTIVE);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        EnrollmentRequest request = TestBuilders.buildEnrollmentRequest(1L, 1L);
        assertThrows(BadRequestException.class, () -> enrollmentService.enrollStudent(request, 1L, "ROLE_ADMIN"));
    }

    @Test
    void enrollStudent_duplicateEnrollment_throwsBadRequest() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(enrollmentRepository.existsByStudentAndCourse(student, course)).thenReturn(true);
        EnrollmentRequest request = TestBuilders.buildEnrollmentRequest(1L, 1L);
        assertThrows(BadRequestException.class, () -> enrollmentService.enrollStudent(request, 1L, "ROLE_ADMIN"));
    }

    @Test
    void removeEnrollment_success_deletesEnrollment() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Enrollment enrollment = buildEnrollment(1L, student, course, Enrollment.Status.ENROLLED);
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(enrollment));
        doNothing().when(enrollmentRepository).deleteById(1L);
        assertDoesNotThrow(() -> enrollmentService.removeEnrollment(1L, 1L, "ROLE_ADMIN"));
    }

    @Test
    void getStudentEnrollments_success_returnsPagedResponse() {
        User student = buildStudent(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(enrollmentRepository.findByStudent(any(), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));
        PagedResponse<EnrollmentResponse> response = enrollmentService.getStudentEnrollments(1L, Pageable.unpaged(), 1L, "ROLE_ADMIN");
        assertNotNull(response);
    }

    @Test
    void getStudentEnrollments_studentViewingOther_throwsAccessDenied() {
        User student = buildStudent(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        assertThrows(AccessDeniedException.class, () -> enrollmentService.getStudentEnrollments(1L, Pageable.unpaged(), 2L, "ROLE_STUDENT"));
    }

    @Test
    void getCourseStudents_teacherOfOtherCourse_throwsAccessDenied() {
        User teacher1 = buildTeacher(1L);
        User teacher2 = buildTeacher(2L);
        Course course = buildCourse(1L, teacher1, Course.Status.ACTIVE);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        assertThrows(AccessDeniedException.class, () -> enrollmentService.getCourseStudents(1L, Pageable.unpaged(), 2L, "ROLE_TEACHER"));
    }

    @Test
    void updateProgress_success_returnsUpdatedResponse() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Enrollment enrollment = buildEnrollment(1L, student, course, Enrollment.Status.ENROLLED);
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(enrollment));
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(i -> i.getArgument(0));
        EnrollmentResponse response = enrollmentService.updateProgress(1L, 50, 2L, "ROLE_TEACHER");
        assertEquals(50, response.getProgress());
    }

    @Test
    void updateProgress_outOfRange_throwsBadRequest() {
        assertThrows(BadRequestException.class, () -> enrollmentService.updateProgress(1L, -1, 1L, "ROLE_ADMIN"));
        assertThrows(BadRequestException.class, () -> enrollmentService.updateProgress(1L, 101, 1L, "ROLE_ADMIN"));
    }

    @Test
    void completeCourse_success_returnsCompletedResponse() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Enrollment enrollment = buildEnrollment(1L, student, course, Enrollment.Status.ENROLLED);
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(enrollment));
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(i -> i.getArgument(0));
        EnrollmentResponse response = enrollmentService.completeCourse(1L, 1L, "ROLE_STUDENT");
        assertEquals(Enrollment.Status.COMPLETED.name(), response.getStatus());
        assertEquals(100, response.getProgress());
    }
}
