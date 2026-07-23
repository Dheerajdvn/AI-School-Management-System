package com.ai.dashboard.testutil;

import com.ai.dashboard.dto.*;
import com.ai.dashboard.entity.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class TestBuilders {

    public static User userBuilder(Long id, String username, String email, String roleName) {
        Role role = Role.builder()
                .id((long) (roleName.hashCode() + id.hashCode()))
                .name(roleName)
                .build();

        return User.builder()
                .id(id)
                .username(username)
                .email(email)
                .password("encodedPassword")
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .roles(new HashSet<>(Set.of(role)))
                .build();
    }

    public static User buildUser(Long id, String username, String email, String roleName) {
        return userBuilder(id, username, email, roleName);
    }

    public static User buildUser(Long id, String username, String email, Set<Role> roles) {
        return User.builder()
                .id(id)
                .username(username)
                .email(email)
                .password("encodedPassword")
                .enabled(true)
                .roles(roles)
                .build();
    }

    public static Course buildCourse(Long id, String code, String title, String description, User teacher, Course.Status status) {
        return Course.builder()
                .id(id)
                .courseCode(code)
                .title(title)
                .description(description)
                .teacher(teacher)
                .status(status)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Assignment buildAssignment(Long id, String title, String description, User teacher, Course course, com.ai.dashboard.entity.Assignment.Status status) {
        return Assignment.builder()
                .id(id)
                .title(title)
                .description(description)
                .instructions("Instructions")
                .dueDate(LocalDateTime.now().plusDays(7))
                .maxMarks(100)
                .attachmentUrl("http://example.com/attachment")
                .status(status)
                .teacher(teacher)
                .course(course)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Submission buildSubmission(Long id, Assignment assignment, User student, Submission.Status status) {
        return Submission.builder()
                .id(id)
                .assignment(assignment)
                .student(student)
                .submissionText("Submission text")
                .attachmentUrl("http://example.com/submission")
                .status(status)
                .submittedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Enrollment buildEnrollment(Long id, User student, Course course, Enrollment.Status status) {
        return Enrollment.builder()
                .id(id)
                .student(student)
                .course(course)
                .enrollmentDate(LocalDate.now())
                .status(status)
                .progress(0)
                .build();
    }

    public static GradeHistory buildGradeHistory(Long id, Submission submission, User updatedBy) {
        return GradeHistory.builder()
                .id(id)
                .submission(submission)
                .previousMarks(80)
                .newMarks(90)
                .previousFeedback("Good")
                .newFeedback("Excellent")
                .updatedBy(updatedBy)
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Student buildStudent(Long id, String name, String course, String subject, Double fee, String address, LocalDate joiningDate) {
        return Student.builder()
                .id(id)
                .name(name)
                .course(course)
                .subject(subject)
                .fee(fee)
                .address(address)
                .joiningDate(joiningDate)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static CreateUserRequest buildCreateUserRequest(String username, String email, String password, Set<String> roles) {
        CreateUserRequest req = new CreateUserRequest();
        req.setUsername(username);
        req.setEmail(email);
        req.setPassword(password);
        req.setRoles(roles);
        return req;
    }

    public static UpdateUserRequest buildUpdateUserRequest(String username, String email, String password, Set<String> roles, Boolean enabled) {
        UpdateUserRequest req = new UpdateUserRequest();
        req.setUsername(username);
        req.setEmail(email);
        req.setPassword(password);
        req.setRoles(roles);
        req.setEnabled(enabled);
        return req;
    }

    public static CourseRequest buildCourseRequest(String courseCode, String title, String description, Long teacherId, String status) {
        CourseRequest req = new CourseRequest();
        req.setCourseCode(courseCode);
        req.setTitle(title);
        req.setDescription(description);
        req.setTeacherId(teacherId);
        req.setStatus(status);
        return req;
    }

    public static AssignmentRequest buildAssignmentRequest(String title, String description, LocalDateTime dueDate, Integer maxMarks) {
        AssignmentRequest req = new AssignmentRequest();
        req.setTitle(title);
        req.setDescription(description);
        req.setInstructions("Test instructions");
        req.setDueDate(dueDate);
        req.setMaxMarks(maxMarks);
        req.setAttachmentUrl("http://example.com/attachment");
        return req;
    }

    public static EnrollmentRequest buildEnrollmentRequest(Long studentId, Long courseId) {
        EnrollmentRequest req = new EnrollmentRequest();
        req.setStudentId(studentId);
        req.setCourseId(courseId);
        return req;
    }

    public static SubmissionRequest buildSubmissionRequest(String text, String attachmentUrl) {
        SubmissionRequest req = new SubmissionRequest();
        req.setSubmissionText(text);
        req.setAttachmentUrl(attachmentUrl);
        return req;
    }

    public static GradeRequest buildGradeRequest(Integer obtainedMarks, String feedback, String privateNotes) {
        GradeRequest req = new GradeRequest();
        req.setObtainedMarks(obtainedMarks);
        req.setFeedback(feedback);
        req.setPrivateNotes(privateNotes);
        return req;
    }

    public static LoginRequest buildLoginRequest(String username, String password) {
        LoginRequest req = new LoginRequest();
        req.setUsername(username);
        req.setPassword(password);
        return req;
    }

    public static RegisterRequest buildRegisterRequest(String username, String email, String password) {
        RegisterRequest req = new RegisterRequest();
        req.setUsername(username);
        req.setEmail(email);
        req.setPassword(password);
        return req;
    }

    public static AiQueryRequest buildAiQueryRequest(String question) {
        AiQueryRequest req = new AiQueryRequest();
        req.setQuestion(question);
        return req;
    }

    public static ChatMessage buildChatMessage(String role, String content) {
        ChatMessage msg = new ChatMessage();
        msg.setRole(role);
        msg.setContent(content);
        return msg;
    }

    public static StudentDto buildStudentDto(Long id, String name, String course, String subject, Double fee, String address, LocalDate joiningDate) {
        StudentDto dto = new StudentDto();
        dto.setId(id);
        dto.setName(name);
        dto.setCourse(course);
        dto.setSubject(subject);
        dto.setFee(fee);
        dto.setAddress(address);
        dto.setJoiningDate(joiningDate);
        return dto;
    }

    public static PageRequestBuilder pageRequest() {
        return new PageRequestBuilder();
    }

    public static class PageRequestBuilder {
        private int page = 0;
        private int size = 20;
        private String sortBy = "id";
        private String direction = "asc";

        public PageRequestBuilder page(int page) {
            this.page = page;
            return this;
        }

        public PageRequestBuilder size(int size) {
            this.size = size;
            return this;
        }

        public PageRequestBuilder sortBy(String sortBy) {
            this.sortBy = sortBy;
            return this;
        }

        public PageRequestBuilder direction(String direction) {
            this.direction = direction;
            return this;
        }

        public org.springframework.data.domain.Pageable build() {
            return org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by(direction.equalsIgnoreCase("desc") ? org.springframework.data.domain.Sort.Direction.DESC : org.springframework.data.domain.Sort.Direction.ASC, sortBy));
        }
    }
}
