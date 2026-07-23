package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.GradeHistoryResponse;
import com.ai.dashboard.dto.GradeRequest;
import com.ai.dashboard.dto.GradeResponse;
import com.ai.dashboard.dto.GradeStatistics;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.GradeHistory;
import com.ai.dashboard.entity.Submission;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.GradeHistoryRepository;
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
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GradeServiceImplTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private GradeHistoryRepository gradeHistoryRepository;

    @InjectMocks
    private GradeServiceImpl gradeService;

    private User buildStudent(Long id) {
        return TestBuilders.buildUser(id, "student" + id, "student" + id + "@example.com", "ROLE_STUDENT");
    }

    private User buildTeacher(Long id) {
        return TestBuilders.buildUser(id, "teacher" + id, "teacher" + id + "@example.com", "ROLE_TEACHER");
    }

    private Course buildCourse(Long id, User teacher, Course.Status status) {
        return TestBuilders.buildCourse(id, "CS" + id, "Course" + id, "Desc", teacher, status);
    }

    private Assignment buildAssignment(Long id, Course course, User teacher, Assignment.Status status) {
        return TestBuilders.buildAssignment(id, "Assignment" + id, "Desc", teacher, course, status);
    }

    private Submission buildSubmission(Long id, Assignment assignment, User student, Submission.Status status) {
        return TestBuilders.buildSubmission(id, assignment, student, status);
    }

    @Test
    void gradeSubmission_success_returnsGradeResponse() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        Submission submission = buildSubmission(1L, assignment, student, Submission.Status.SUBMITTED);
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(userRepository.findById(2L)).thenReturn(Optional.of(teacher));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(i -> i.getArgument(0));
        GradeRequest request = TestBuilders.buildGradeRequest(85, "Good", "Nice");
        GradeResponse response = gradeService.gradeSubmission(1L, request, 2L, "ROLE_TEACHER");
        assertEquals(85, response.getObtainedMarks());
        assertTrue(response.getPublished());
    }

    @Test
    void gradeSubmission_marksExceedMax_throwsBadRequest() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        assignment.setMaxMarks(50);
        Submission submission = buildSubmission(1L, assignment, student, Submission.Status.SUBMITTED);
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        GradeRequest request = TestBuilders.buildGradeRequest(100, "Good", null);
        assertThrows(BadRequestException.class, () -> gradeService.gradeSubmission(1L, request, 2L, "ROLE_TEACHER"));
    }

    @Test
    void updateGrade_success_createsHistoryAndReturnsResponse() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        Submission submission = buildSubmission(1L, assignment, student, Submission.Status.SUBMITTED);
        submission.setObtainedMarks(70);
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(userRepository.findById(2L)).thenReturn(Optional.of(teacher));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(i -> i.getArgument(0));
        GradeRequest request = TestBuilders.buildGradeRequest(85, "Good", null);
        GradeResponse response = gradeService.updateGrade(1L, request, 2L, "ROLE_TEACHER");
        assertEquals(85, response.getObtainedMarks());
    }

    @Test
    void publishGrade_success_returnsPublishedResponse() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        Submission submission = buildSubmission(1L, assignment, student, Submission.Status.SUBMITTED);
        submission.setObtainedMarks(85);
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(i -> i.getArgument(0));
        GradeResponse response = gradeService.publishGrade(1L, 1L, "ROLE_TEACHER");
        assertTrue(response.getPublished());
    }

    @Test
    void publishGrade_ungradedSubmission_throwsBadRequest() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        Submission submission = buildSubmission(1L, assignment, student, Submission.Status.SUBMITTED);
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        assertThrows(BadRequestException.class, () -> gradeService.publishGrade(1L, 1L, "ROLE_TEACHER"));
    }

    @Test
    void getStudentGrades_success_returnsPagedResponse() {
        User student = buildStudent(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(submissionRepository.findByStudent(any(), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));
        PagedResponse<GradeResponse> response = gradeService.getStudentGrades(1L, Pageable.unpaged(), 1L, "ROLE_ADMIN");
        assertNotNull(response);
    }

    @Test
    void getCourseGrades_success_returnsPagedResponse() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(submissionRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));
        PagedResponse<GradeResponse> response = gradeService.getCourseGrades(1L, Pageable.unpaged(), 1L, "ROLE_TEACHER");
        assertNotNull(response);
    }

    @Test
    void getGradeHistory_success_returnsPagedResponse() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        Submission submission = buildSubmission(1L, assignment, student, Submission.Status.GRADED);
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        GradeHistory history = TestBuilders.buildGradeHistory(1L, submission, teacher);
        when(gradeHistoryRepository.findBySubmission(any(), any(Pageable.class))).thenReturn(new PageImpl<>(List.of(history)));
        PagedResponse<GradeHistoryResponse> response = gradeService.getGradeHistory(1L, Pageable.unpaged(), 2L, "ROLE_TEACHER");
        assertNotNull(response);
    }

    @Test
    void getStatistics_noGradedSubmissions_returnsEmptyStatistics() {
        when(submissionRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class)))
                .thenReturn(List.of());
        GradeStatistics stats = gradeService.getStatistics(1L, null, 1L, "ROLE_TEACHER");
        assertEquals(0, stats.getGradedSubmissions());
        assertNull(stats.getMostCommonLetterGrade());
    }
}
