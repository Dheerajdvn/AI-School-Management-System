package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.GradeHistoryResponse;
import com.ai.dashboard.dto.GradeRequest;
import com.ai.dashboard.dto.GradeResponse;
import com.ai.dashboard.dto.GradeStatistics;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.entity.*;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.*;
import com.ai.dashboard.service.GradeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Default implementation of {@link GradeService}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GradeServiceImpl implements GradeService {

    private final SubmissionRepository submissionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final GradeHistoryRepository gradeHistoryRepository;

    @Override
    @Transactional
    public GradeResponse gradeSubmission(Long submissionId, GradeRequest request, Long currentUserId, String currentUserRole) {
        log.debug("Grading submission id={}", submissionId);

        validateTeacherOrAdminRole(currentUserRole);

        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + submissionId));

        validateTeacherOrAdminAccess(submission.getAssignment(), currentUserId, currentUserRole);

        validateMarks(submission, request.getObtainedMarks());

        User teacher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id " + currentUserId));

        // Create grade history if there was a previous grade
        if (submission.getObtainedMarks() != null) {
            createGradeHistory(submission, submission.getObtainedMarks(), submission.getFeedback(), submission.getPrivateNotes(), teacher);
        }

        submission.setObtainedMarks(request.getObtainedMarks());
        submission.setFeedback(request.getFeedback());
        submission.setPrivateNotes(request.getPrivateNotes());
        submission.setGradedAt(LocalDateTime.now());
        submission.setGradedBy(teacher);
        submission.setStatus(Submission.Status.GRADED);

        Submission saved = submissionRepository.save(submission);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public GradeResponse updateGrade(Long submissionId, GradeRequest request, Long currentUserId, String currentUserRole) {
        log.debug("Updating grade for submission id={}", submissionId);

        validateTeacherOrAdminRole(currentUserRole);

        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + submissionId));

        validateTeacherOrAdminAccess(submission.getAssignment(), currentUserId, currentUserRole);

        // Check if grade is already published
        if (submission.getStatus() == Submission.Status.GRADED && !"ROLE_ADMIN".equals(currentUserRole)) {
            throw new BadRequestException("Published grades cannot be updated");
        }

        validateMarks(submission, request.getObtainedMarks());

        // Store previous values for history
        Integer previousMarks = submission.getObtainedMarks();
        String previousFeedback = submission.getFeedback();
        String previousPrivateNotes = submission.getPrivateNotes();

        User teacher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id " + currentUserId));

        submission.setObtainedMarks(request.getObtainedMarks());
        submission.setFeedback(request.getFeedback());
        submission.setPrivateNotes(request.getPrivateNotes());
        submission.setGradedAt(LocalDateTime.now());
        submission.setGradedBy(teacher);

        // Create grade history entry
        createGradeHistory(submission, previousMarks, previousFeedback, previousPrivateNotes, teacher);

        Submission saved = submissionRepository.save(submission);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public GradeResponse publishGrade(Long submissionId, Long currentUserId, String currentUserRole) {
        log.debug("Publishing grade for submission id={}", submissionId);

        validateTeacherOrAdminRole(currentUserRole);

        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + submissionId));

        validateTeacherOrAdminAccess(submission.getAssignment(), currentUserId, currentUserRole);

        if (submission.getObtainedMarks() == null) {
            throw new BadRequestException("Cannot publish ungraded submission");
        }

        submission.setStatus(Submission.Status.GRADED);
        Submission saved = submissionRepository.save(submission);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<GradeResponse> getStudentGrades(Long studentId, Pageable pageable, Long currentUserId, String currentUserRole) {
        validateStudentOrTeacherAccess(studentId, currentUserId, currentUserRole);

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + studentId));

        Page<Submission> result = submissionRepository.findByStudent(student, pageable);
        return toPagedGradeResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<GradeResponse> getCourseGrades(Long courseId, Pageable pageable, Long currentUserId, String currentUserRole) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + courseId));

        validateTeacherOrAdminAccessForCourse(course, currentUserId, currentUserRole);

        Page<Submission> result = submissionRepository.findAll(
                SubmissionSpecifications.hasCourseId(courseId), pageable);
        return toPagedGradeResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<GradeHistoryResponse> getGradeHistory(Long submissionId, Pageable pageable, Long currentUserId, String currentUserRole) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + submissionId));

        validateTeacherOrAdminAccess(submission.getAssignment(), currentUserId, currentUserRole);

        Page<GradeHistory> result = gradeHistoryRepository.findBySubmission(submission, pageable);
        return toPagedGradeHistoryResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public GradeStatistics getStatistics(Long courseId, Long assignmentId, Long currentUserId, String currentUserRole) {
        validateTeacherOrAdminRole(currentUserRole);

        // Validate course access
        if (courseId != null) {
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + courseId));
            validateTeacherOrAdminAccessForCourse(course, currentUserId, currentUserRole);
        }

        // Get all graded submissions
        List<Submission> submissions = submissionRepository.findAll(
                SubmissionSpecifications.hasCourseId(courseId));

        if (assignmentId != null) {
            submissions = submissions.stream()
                    .filter(s -> s.getAssignment().getId().equals(assignmentId))
                    .collect(Collectors.toList());
        }

        // Filter only graded submissions
        List<Submission> gradedSubmissions = submissions.stream()
                .filter(s -> s.getStatus() == Submission.Status.GRADED)
                .toList();

        int totalSubmissions = submissions.size();
        int gradedCount = gradedSubmissions.size();
        int ungradedCount = totalSubmissions - gradedCount;

        if (gradedCount == 0) {
            return GradeStatistics.builder()
                    .courseId(courseId)
                    .assignmentId(assignmentId)
                    .totalSubmissions(totalSubmissions)
                    .gradedSubmissions(gradedCount)
                    .ungradedSubmissions(ungradedCount)
                    .build();
        }

        // Calculate statistics
        List<Double> percentages = gradedSubmissions.stream()
                .map(this::calculatePercentage)
                .filter(Objects::nonNull)
                .toList();

        Double averagePercentage = percentages.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
        Double minPercentage = percentages.stream()
                .mapToDouble(Double::doubleValue)
                .min()
                .orElse(0.0);
        Double maxPercentage = percentages.stream()
                .mapToDouble(Double::doubleValue)
                .max()
                .orElse(0.0);

        // Count letter grades
        Map<String, Long> letterGradeCounts = percentages.stream()
                .collect(Collectors.groupingBy(this::calculateLetterGrade, Collectors.counting()));

        String mostCommonLetterGrade = letterGradeCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        return GradeStatistics.builder()
                .courseId(courseId)
                .assignmentId(assignmentId)
                .totalSubmissions(totalSubmissions)
                .gradedSubmissions(gradedCount)
                .ungradedSubmissions(ungradedCount)
                .averagePercentage(Math.round(averagePercentage * 100.0) / 100.0)
                .minPercentage(Math.round(minPercentage * 100.0) / 100.0)
                .maxPercentage(Math.round(maxPercentage * 100.0) / 100.0)
                .mostCommonLetterGrade(mostCommonLetterGrade)
                .gradeACount(letterGradeCounts.getOrDefault("A", 0L).intValue())
                .gradeBCount(letterGradeCounts.getOrDefault("B", 0L).intValue())
                .gradeCCount(letterGradeCounts.getOrDefault("C", 0L).intValue())
                .gradeDCount(letterGradeCounts.getOrDefault("D", 0L).intValue())
                .gradeFCount(letterGradeCounts.getOrDefault("F", 0L).intValue())
                .build();
    }

    // ------------------------------------------------------------------

    private void validateTeacherOrAdminRole(String currentUserRole) {
        if ("ROLE_STUDENT".equals(currentUserRole)) {
            throw new AccessDeniedException("Students cannot grade submissions");
        }
    }

    private void validateMarks(Submission submission, Integer obtainedMarks) {
        if (obtainedMarks != null && submission.getAssignment() != null) {
            Integer maxMarks = submission.getAssignment().getMaxMarks();
            if (maxMarks != null && obtainedMarks > maxMarks) {
                throw new BadRequestException("Obtained marks cannot exceed max marks: " + maxMarks);
            }
        }
    }

    private void validateTeacherOrAdminAccess(Assignment assignment, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }
        if (!assignment.getCourse().getTeacher().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You can only grade submissions for your own courses");
        }
    }

    private void validateTeacherOrAdminAccessForCourse(Course course, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }
        if (!course.getTeacher().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You can only view grades for your own courses");
        }
    }

    private void validateStudentOrTeacherAccess(Long studentId, Long currentUserId, String currentUserRole) {
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return;
        }
        if ("ROLE_TEACHER".equals(currentUserRole)) {
            return;
        }
        if (!studentId.equals(currentUserId)) {
            throw new AccessDeniedException("You can only view your own grades");
        }
    }

    private void createGradeHistory(Submission submission, Integer previousMarks, String previousFeedback, String previousPrivateNotes, User updatedBy) {
        GradeHistory history = GradeHistory.builder()
                .submission(submission)
                .previousMarks(previousMarks)
                .newMarks(submission.getObtainedMarks())
                .previousFeedback(previousFeedback)
                .newFeedback(submission.getFeedback())
                .privateNotes(previousPrivateNotes)
                .updatedBy(updatedBy)
                .build();
        gradeHistoryRepository.save(history);
    }

    private GradeResponse toResponse(Submission submission) {
        Double percentage = calculatePercentage(submission);
        String letterGrade = calculateLetterGrade(percentage);
        String passFail = calculatePassFail(percentage);

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
                .letterGrade(letterGrade)
                .passFail(passFail)
                .feedback(submission.getFeedback())
                .privateNotes(submission.getPrivateNotes())
                .published(submission.getStatus() == Submission.Status.GRADED)
                .gradedAt(submission.getGradedAt())
                .gradedById(submission.getGradedBy() != null ? submission.getGradedBy().getId() : null)
                .gradedByName(submission.getGradedBy() != null ? submission.getGradedBy().getUsername() : null)
                .build();
    }

    private PagedResponse<GradeResponse> toPagedGradeResponse(Page<Submission> result) {
        return PagedResponse.<GradeResponse>builder()
                .content(result.getContent().stream().map(this::toResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }

    private GradeHistoryResponse toHistoryResponse(GradeHistory history) {
        return GradeHistoryResponse.builder()
                .id(history.getId())
                .previousMarks(history.getPreviousMarks())
                .newMarks(history.getNewMarks())
                .previousFeedback(history.getPreviousFeedback())
                .newFeedback(history.getNewFeedback())
                .privateNotes(history.getPrivateNotes())
                .updatedById(history.getUpdatedBy().getId())
                .updatedByName(history.getUpdatedBy().getUsername())
                .updatedAt(history.getUpdatedAt())
                .build();
    }

    private PagedResponse<GradeHistoryResponse> toPagedGradeHistoryResponse(Page<GradeHistory> result) {
        return PagedResponse.<GradeHistoryResponse>builder()
                .content(result.getContent().stream().map(this::toHistoryResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }

    private Double calculatePercentage(Submission submission) {
        if (submission.getObtainedMarks() == null || submission.getAssignment().getMaxMarks() == null) {
            return null;
        }
        return (submission.getObtainedMarks() * 100.0) / submission.getAssignment().getMaxMarks();
    }

    private String calculateLetterGrade(Double percentage) {
        if (percentage == null) {
            return null;
        }
        if (percentage >= 90) return "A";
        if (percentage >= 80) return "B";
        if (percentage >= 70) return "C";
        if (percentage >= 60) return "D";
        return "F";
    }

    private String calculatePassFail(Double percentage) {
        if (percentage == null) {
            return null;
        }
        return percentage >= 60 ? "PASS" : "FAIL";
    }
}