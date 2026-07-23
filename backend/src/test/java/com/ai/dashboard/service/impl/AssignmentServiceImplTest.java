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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssignmentServiceImplTest {

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private AssignmentServiceImpl assignmentService;

    private User buildTeacher(Long id) {
        return TestBuilders.buildUser(id, "teacher" + id, "teacher" + id + "@example.com", "ROLE_TEACHER");
    }

    private Course buildCourse(Long id, User teacher, Course.Status status) {
        return TestBuilders.buildCourse(id, "CS" + id, "Course" + id, "Desc", teacher, status);
    }

    private Assignment buildAssignment(Long id, Course course, User teacher, Assignment.Status status) {
        return TestBuilders.buildAssignment(id, "Assignment" + id, "Desc", teacher, course, status);
    }

    @Test
    void createAssignment_success_returnsResponse() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(userRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(assignmentRepository.save(any(Assignment.class))).thenAnswer(i -> i.getArgument(0));
        AssignmentRequest request = TestBuilders.buildAssignmentRequest("Title", "Desc", LocalDateTime.now().plusDays(7), 100);
        AssignmentResponse response = assignmentService.createAssignment(request, 1L, 1L, "ROLE_TEACHER");
        assertEquals("Title", response.getTitle());
    }

    @Test
    void createAssignment_studentRole_throwsAccessDenied() {
        AssignmentRequest request = TestBuilders.buildAssignmentRequest("Title", "Desc", LocalDateTime.now().plusDays(7), 100);
        assertThrows(AccessDeniedException.class, () -> assignmentService.createAssignment(request, 1L, 1L, "ROLE_STUDENT"));
    }

    @Test
    void createAssignment_inactiveCourse_throwsBadRequest() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.INACTIVE);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        AssignmentRequest request = TestBuilders.buildAssignmentRequest("Title", "Desc", LocalDateTime.now().plusDays(7), 100);
        assertThrows(BadRequestException.class, () -> assignmentService.createAssignment(request, 1L, 1L, "ROLE_TEACHER"));
    }

    @Test
    void createAssignment_pastDueDate_throwsBadRequest() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        AssignmentRequest request = TestBuilders.buildAssignmentRequest("Title", "Desc", LocalDateTime.now().minusDays(1), 100);
        assertThrows(BadRequestException.class, () -> assignmentService.createAssignment(request, 1L, 1L, "ROLE_TEACHER"));
    }

    @Test
    void updateAssignment_success_returnsUpdatedResponse() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment existing = buildAssignment(1L, course, teacher, Assignment.Status.DRAFT);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(assignmentRepository.save(any(Assignment.class))).thenAnswer(i -> i.getArgument(0));
        AssignmentRequest request = TestBuilders.buildAssignmentRequest("Updated Title", "Updated Desc", LocalDateTime.now().plusDays(7), 100);
        AssignmentResponse response = assignmentService.updateAssignment(1L, request, 1L, "ROLE_TEACHER");
        assertEquals("Updated Title", response.getTitle());
    }

    @Test
    void updateAssignment_closedAssignment_throwsBadRequest() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment existing = buildAssignment(1L, course, teacher, Assignment.Status.CLOSED);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(existing));
        AssignmentRequest request = TestBuilders.buildAssignmentRequest("Title", "Desc", LocalDateTime.now().plusDays(7), 100);
        assertThrows(BadRequestException.class, () -> assignmentService.updateAssignment(1L, request, 1L, "ROLE_TEACHER"));
    }

    @Test
    void deleteAssignment_success_deletesAssignment() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.DRAFT);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        doNothing().when(assignmentRepository).deleteById(1L);
        assertDoesNotThrow(() -> assignmentService.deleteAssignment(1L, 1L, "ROLE_TEACHER"));
    }

    @Test
    void publishAssignment_success_returnsPublishedResponse() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.DRAFT);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(assignmentRepository.save(any(Assignment.class))).thenAnswer(i -> i.getArgument(0));
        AssignmentResponse response = assignmentService.publishAssignment(1L, 1L, "ROLE_TEACHER");
        assertEquals(Assignment.Status.PUBLISHED.name(), response.getStatus());
    }

    @Test
    void closeAssignment_success_returnsClosedResponse() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(assignmentRepository.save(any(Assignment.class))).thenAnswer(i -> i.getArgument(0));
        AssignmentResponse response = assignmentService.closeAssignment(1L, 1L, "ROLE_TEACHER");
        assertEquals(Assignment.Status.CLOSED.name(), response.getStatus());
    }

    @Test
    void getAssignment_success_returnsResponse() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        AssignmentResponse response = assignmentService.getAssignment(1L, 1L, "ROLE_TEACHER");
        assertEquals("Title1", response.getTitle());
    }

    @Test
    void getAssignment_studentNotEnrolled_throwsAccessDenied() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(enrollmentRepository.existsByStudentIdAndCourseId(2L, 1L)).thenReturn(false);
        assertThrows(AccessDeniedException.class, () -> assignmentService.getAssignment(1L, 2L, "ROLE_STUDENT"));
    }

    @Test
    void getAssignments_admin_returnsAll() {
        when(assignmentRepository.findAll(Pageable.unpaged())).thenReturn(new PageImpl<>(List.of()));
        PagedResponse<AssignmentResponse> response = assignmentService.getAssignments(Pageable.unpaged(), 1L, "ROLE_ADMIN");
        assertNotNull(response);
    }

    @Test
    void searchAssignments_studentRestrictsToPublished() {
        when(assignmentRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));
        PagedResponse<AssignmentResponse> response = assignmentService.searchAssignments(1L, "Title", "PUBLISHED", Pageable.unpaged(), 1L, "ROLE_STUDENT");
        assertNotNull(response);
    }
}
