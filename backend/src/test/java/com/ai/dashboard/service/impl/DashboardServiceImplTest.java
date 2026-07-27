package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.AdminDashboardResponse;
import com.ai.dashboard.dto.StudentDashboardResponse;
import com.ai.dashboard.dto.TeacherDashboardResponse;
import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.Enrollment;
import com.ai.dashboard.entity.Submission;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.repository.AssignmentRepository;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.EnrollmentRepository;
import com.ai.dashboard.repository.SubmissionRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.testutil.TestBuilders;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class DashboardServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @Test
    void getStudentDashboard_success_returnsResponse() {
        User student = TestBuilders.buildUser(1L, "student", "student@example.com", "ROLE_STUDENT");
        when(enrollmentRepository.findByStudentId(eq(1L), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of()));
        when(assignmentRepository.findAll(any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of()));
        when(submissionRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of()));
        StudentDashboardResponse response = dashboardService.getStudentDashboard(1L, "ROLE_STUDENT");
        assertNotNull(response);
        assertEquals(0L, response.getTotalEnrolledCourses());
    }

    @Test
    void getStudentDashboard_nonStudentNonAdmin_throwsAccessDenied() {
        assertThrows(AccessDeniedException.class, () -> dashboardService.getStudentDashboard(1L, "ROLE_TEACHER"));
    }

    @Test
    void getTeacherDashboard_success_returnsResponse() {
        User teacher = TestBuilders.buildUser(1L, "teacher", "teacher@example.com", "ROLE_TEACHER");
        when(courseRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of()));
        TeacherDashboardResponse response = dashboardService.getTeacherDashboard(1L, "ROLE_TEACHER");
        assertNotNull(response);
        assertEquals(0L, response.getCoursesTaught());
    }

    @Test
    void getTeacherDashboard_nonTeacherNonAdmin_throwsAccessDenied() {
        assertThrows(AccessDeniedException.class, () -> dashboardService.getTeacherDashboard(1L, "ROLE_STUDENT"));
    }

    @Test
    void getAdminDashboard_success_returnsResponse() {
        when(userRepository.count()).thenReturn(10L);
        when(userRepository.findAll(any(PageRequest.class))).thenReturn(new PageImpl<>(List.of()));
        when(courseRepository.count()).thenReturn(5L);
        when(enrollmentRepository.findAll(any(PageRequest.class))).thenReturn(new PageImpl<>(List.of()));
        when(assignmentRepository.count()).thenReturn(20L);
        when(submissionRepository.count()).thenReturn(50L);
        when(submissionRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of()));
        AdminDashboardResponse response = dashboardService.getAdminDashboard("ROLE_ADMIN");
        assertNotNull(response);
        assertEquals(10L, response.getTotalUsers());
        assertEquals(5L, response.getCourses());
    }

    @Test
    void getAdminDashboard_nonAdmin_throwsAccessDenied() {
        assertThrows(AccessDeniedException.class, () -> dashboardService.getAdminDashboard("ROLE_STUDENT"));
    }
}
