package com.ai.dashboard.security;

import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Submission;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.repository.SubmissionRepository;
import com.ai.dashboard.service.impl.SubmissionServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ObjectLevelAuthorizationTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @InjectMocks
    private SubmissionServiceImpl submissionService;

    @Test
    @DisplayName("Student accessing another student's submission throws AccessDeniedException")
    void testStudentAccessingOtherSubmissionBlocked() {
        User owner = User.builder().id(100L).username("studentA").build();
        User otherStudent = User.builder().id(200L).username("studentB").build();
        Assignment assignment = Assignment.builder().id(10L).title("Math HW").build();

        Submission submission = Submission.builder()
                .id(50L)
                .student(owner)
                .assignment(assignment)
                .status(Submission.Status.SUBMITTED)
                .build();

        when(submissionRepository.findById(50L)).thenReturn(Optional.of(submission));

        assertThatThrownBy(() -> submissionService.getSubmission(50L, otherStudent.getId(), "ROLE_STUDENT"))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("You can only view your own submissions");
    }
}
