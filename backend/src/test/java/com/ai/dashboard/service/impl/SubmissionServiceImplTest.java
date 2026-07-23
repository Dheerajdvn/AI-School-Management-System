package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.GradeRequest;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.dto.SubmissionRequest;
import com.ai.dashboard.dto.SubmissionResponse;
import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.Submission;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.AssignmentRepository;
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
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceImplTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private SubmissionServiceImpl submissionService;

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
    void submitAssignment_success_returnsResponse() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(enrollmentRepository.existsByStudentIdAndCourseId(1L, 1L)).thenReturn(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(submissionRepository.existsByAssignmentAndStudent(assignment, student)).thenReturn(false);
        when(submissionRepository.save(any(Submission.class))).thenAnswer(i -> i.getArgument(0));
        SubmissionRequest request = TestBuilders.buildSubmissionRequest("My submission", "http://example.com/file");
        SubmissionResponse response = submissionService.submitAssignment(1L, request, 1L, "ROLE_STUDENT");
        assertEquals("My submission", response.getSubmissionText());
    }

    @Test
    void submitAssignment_studentNotEnrolled_throwsAccessDenied() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(enrollmentRepository.existsByStudentIdAndCourseId(1L, 1L)).thenReturn(false);
        SubmissionRequest request = TestBuilders.buildSubmissionRequest("My submission", "http://example.com/file");
        assertThrows(AccessDeniedException.class, () -> submissionService.submitAssignment(1L, request, 1L, "ROLE_STUDENT"));
    }

    @Test
    void submitAssignment_duplicateSubmission_throwsBadRequest() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(enrollmentRepository.existsByStudentIdAndCourseId(1L, 1L)).thenReturn(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(submissionRepository.existsByAssignmentAndStudent(assignment, student)).thenReturn(true);
        SubmissionRequest request = TestBuilders.buildSubmissionRequest("My submission", "http://example.com/file");
        assertThrows(BadRequestException.class, () -> submissionService.submitAssignment(1L, request, 1L, "ROLE_STUDENT"));
    }

    @Test
    void submitAssignment_unpublishedAssignment_throwsBadRequest() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.DRAFT);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        SubmissionRequest request = TestBuilders.buildSubmissionRequest("My submission", "http://example.com/file");
        assertThrows(BadRequestException.class, () -> submissionService.submitAssignment(1L, request, 1L, "ROLE_STUDENT"));
    }

    @Test
    void updateSubmission_success_returnsUpdatedResponse() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        Submission existing = buildSubmission(1L, assignment, student, Submission.Status.SUBMITTED);
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(i -> i.getArgument(0));
        SubmissionRequest request = TestBuilders.buildSubmissionRequest("Updated text", "http://example.com/newfile");
        SubmissionResponse response = submissionService.updateSubmission(1L, request, 1L, "ROLE_STUDENT");
        assertEquals("Updated text", response.getSubmissionText());
    }

    @Test
    void updateSubmission_gradedSubmission_throwsBadRequest() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        Submission existing = buildSubmission(1L, assignment, student, Submission.Status.GRADED);
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(existing));
        SubmissionRequest request = TestBuilders.buildSubmissionRequest("Updated text", "http://example.com/newfile");
        assertThrows(BadRequestException.class, () -> submissionService.updateSubmission(1L, request, 1L, "ROLE_STUDENT"));
    }

    @Test
    void deleteSubmission_success_deletesSubmission() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        Submission submission = buildSubmission(1L, assignment, student, Submission.Status.SUBMITTED);
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        doNothing().when(submissionRepository).deleteById(1L);
        assertDoesNotThrow(() -> submissionService.deleteSubmission(1L, 1L, "ROLE_STUDENT"));
    }

    @Test
    void gradeSubmission_success_returnsGradedResponse() {
        User student = buildStudent(1L);
        User teacher = buildTeacher(2L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        Submission submission = buildSubmission(1L, assignment, student, Submission.Status.SUBMITTED);
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(userRepository.findById(2L)).thenReturn(Optional.of(teacher));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(i -> i.getArgument(0));
        GradeRequest request = TestBuilders.buildGradeRequest(90, "Good", "Nice work");
        SubmissionResponse response = submissionService.gradeSubmission(1L, request, 2L, "ROLE_TEACHER");
        assertEquals(90, response.getObtainedMarks());
        assertEquals(Submission.Status.GRADED.name(), response.getStatus());
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
        assertThrows(BadRequestException.class, () -> submissionService.gradeSubmission(1L, request, 2L, "ROLE_TEACHER"));
    }

    @Test
    void getStudentSubmissions_success_returnsPagedResponse() {
        User student = buildStudent(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(submissionRepository.findByStudent(any(), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));
        PagedResponse<SubmissionResponse> response = submissionService.getStudentSubmissions(1L, Pageable.unpaged(), 1L, "ROLE_STUDENT");
        assertNotNull(response);
    }

    @Test
    void getAssignmentSubmissions_success_returnsPagedResponse() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        Assignment assignment = buildAssignment(1L, course, teacher, Assignment.Status.PUBLISHED);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(submissionRepository.findByAssignment(any(), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));
        PagedResponse<SubmissionResponse> response = submissionService.getAssignmentSubmissions(1L, Pageable.unpaged(), 1L, "ROLE_TEACHER");
        assertNotNull(response);
    }
}
