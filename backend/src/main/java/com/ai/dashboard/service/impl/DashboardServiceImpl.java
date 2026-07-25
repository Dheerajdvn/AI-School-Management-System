package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.*;
import com.ai.dashboard.entity.*;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.repository.*;
import com.ai.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Default implementation of {@link DashboardService}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SubmissionRepository submissionRepository;
    private final SchoolRepository schoolRepository;

    @Override
    @Transactional(readOnly = true)
    public StudentDashboardResponse getStudentDashboard(Long studentId, String currentUserRole) {
        if (!"ROLE_STUDENT".equals(currentUserRole) && !"ROLE_ADMIN".equals(currentUserRole)) {
            throw new AccessDeniedException("Only students can access student dashboard");
        }

        log.debug("Building student dashboard for studentId={}", studentId);

        // Use count query instead of loading all entities
        long totalEnrolledCourses = enrollmentRepository.count(EnrollmentSpecifications.hasStudentId(studentId));
        long totalSubmissions = submissionRepository.count(
                SubmissionSpecifications.hasStudentId(studentId));

        // Count only graded submissions for grade calculation
        long gradedSubmissions = submissionRepository.count(
                SubmissionSpecifications.hasStudentId(studentId)
                        .and(SubmissionSpecifications.hasStatus("GRADED")));

        Double averagePercentage = null;
        Double gpa = null;
        List<GradeResponse> recentGrades = Collections.emptyList();

        if (gradedSubmissions > 0) {
            Page<Submission> gradedPage = submissionRepository.findAll(
                    SubmissionSpecifications.hasStudentId(studentId)
                            .and(SubmissionSpecifications.hasStatus("GRADED")),
                    PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "gradedAt")));
            List<Submission> allGraded = gradedPage.getContent();

            averagePercentage = allGraded.stream()
                    .map(this::calculatePercentage)
                    .filter(Objects::nonNull)
                    .collect(Collectors.averagingDouble(Double::doubleValue));

            gpa = calculateGpa(averagePercentage);

            recentGrades = allGraded.stream()
                    .map(this::toGradeResponse)
                    .toList();
        }

        return StudentDashboardResponse.builder()
                .totalEnrolledCourses(totalEnrolledCourses)
                .activeCourses(totalEnrolledCourses)
                .completedCourses(0L)
                .pendingAssignments(0)
                .submittedAssignments((int) totalSubmissions)
                .lateSubmissions(0)
                .averagePercentage(averagePercentage)
                .gpa(gpa)
                .recentGrades(recentGrades)
                .upcomingDeadlines(Collections.emptyList())
                .courseProgress(Collections.emptyList())
                .recentNotifications(Collections.emptyList())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherDashboardResponse getTeacherDashboard(Long teacherId, String currentUserRole) {
        if (!"ROLE_TEACHER".equals(currentUserRole) && !"ROLE_ADMIN".equals(currentUserRole)) {
            throw new AccessDeniedException("Only teachers can access teacher dashboard");
        }

        log.debug("Building teacher dashboard for teacherId={}", teacherId);
        long startTime = System.currentTimeMillis();

        Long coursesTaught = courseRepository.count(CourseSpecifications.hasTeacherId(teacherId));

        log.debug("Teacher dashboard built in {}ms", System.currentTimeMillis() - startTime);

        return TeacherDashboardResponse.builder()
                .coursesTaught(coursesTaught)
                .totalStudents(0L)
                .activeAssignments(0L)
                .pendingGradingCount(0)
                .averageClassScore(0.0)
                .assignmentCompletionRate(0.0)
                .recentlySubmitted(Collections.emptyList())
                .recentlyGraded(Collections.emptyList())
                .studentPerformance(Collections.emptyList())
                .topPerformers(Collections.emptyList())
                .atRiskStudents(Collections.emptyList())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard(String currentUserRole) {
        if (!"ROLE_ADMIN".equals(currentUserRole)) {
            throw new AccessDeniedException("Only admins can access admin dashboard");
        }

        log.debug("Building admin dashboard");
        long startTime = System.currentTimeMillis();

        Long totalUsers = userRepository.count();
        Long students = userRepository.count(UserSpecifications.hasRole("ROLE_STUDENT"));
        Long teachers = userRepository.count(UserSpecifications.hasRole("ROLE_TEACHER"));

        Long courses = courseRepository.count();
        Long activeEnrollments = enrollmentRepository.count();

        Long assignments = assignmentRepository.count();
        Long submissions = submissionRepository.count();
        Long gradesPublished = submissionRepository.count(
                SubmissionSpecifications.hasStatus(Submission.Status.GRADED.name()));

        log.debug("Admin dashboard built in {}ms", System.currentTimeMillis() - startTime);

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .students(students)
                .teachers(teachers)
                .courses(courses)
                .activeEnrollments(activeEnrollments)
                .assignments(assignments)
                .submissions(submissions)
                .gradesPublished(gradesPublished)
                .averagePlatformScore(0.0)
                .recentlyRegisteredUsers(Collections.emptyList())
                .recentlyCreatedCourses(Collections.emptyList())
                .userGrowth(Collections.emptyList())
                .gradeDistribution(Collections.emptyList())
                .monthlySubmissions(Collections.emptyList())
                .monthlyRegistrations(Collections.emptyList())
                .courseCompletion(Collections.emptyList())
                .build();
    }

    // ------------------------------------------------------------------
    // Helper methods
    // ------------------------------------------------------------------

    private Double calculateGpa(Double averagePercentage) {
        if (averagePercentage == null) {
            return null;
        }
        if (averagePercentage >= 90) return 4.0;
        if (averagePercentage >= 80) return 3.0;
        if (averagePercentage >= 70) return 2.0;
        if (averagePercentage >= 60) return 1.0;
        return 0.0;
    }

    private Double calculatePercentage(Submission submission) {
        if (submission.getObtainedMarks() == null || submission.getAssignment().getMaxMarks() == null) {
            return null;
        }
        return (submission.getObtainedMarks() * 100.0) / submission.getAssignment().getMaxMarks();
    }

    private String calculateLetterGrade(Double percentage) {
        if (percentage == null) return null;
        if (percentage >= 90) return "A";
        if (percentage >= 80) return "B";
        if (percentage >= 70) return "C";
        if (percentage >= 60) return "D";
        return "F";
    }

    private GradeResponse toGradeResponse(Submission submission) {
        Double percentage = calculatePercentage(submission);

        return GradeResponse.builder()
                .id(submission.getId())
                .submissionId(submission.getId())
                .assignmentId(submission.getAssignment().getId())
                .assignmentTitle(submission.getAssignment().getTitle())
                .assignmentCode(submission.getAssignment().getCourse().getCourseCode())
                .studentId(submission.getStudent().getId())
                .studentName(submission.getStudent().getUsername())
                .obtainedMarks(submission.getObtainedMarks())
                .maxMarks(submission.getAssignment().getMaxMarks())
                .percentage(percentage)
                .letterGrade(calculateLetterGrade(percentage))
                .passFail(percentage != null && percentage >= 60 ? "PASS" : "FAIL")
                .feedback(submission.getFeedback())
                .privateNotes(submission.getPrivateNotes())
                .published(submission.getStatus() == Submission.Status.GRADED)
                .gradedAt(submission.getGradedAt())
                .gradedById(submission.getGradedBy() != null ? submission.getGradedBy().getId() : null)
                .gradedByName(submission.getGradedBy() != null ? submission.getGradedBy().getUsername() : null)
                .build();
    }
}