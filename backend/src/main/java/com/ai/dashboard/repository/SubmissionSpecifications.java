package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Submission;
import com.ai.dashboard.entity.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

/**
 * Specifications for Submission entity filtering.
 */
public class SubmissionSpecifications {

    public static Specification<Submission> hasAssignment(Assignment assignment) {
        return (root, query, cb) -> {
            if (assignment == null) {
                return null;
            }
            return cb.equal(root.get("assignment"), assignment);
        };
    }

    public static Specification<Submission> hasAssignmentId(Long assignmentId) {
        return (root, query, cb) -> {
            if (assignmentId == null) {
                return null;
            }
            return cb.equal(root.get("assignment").get("id"), assignmentId);
        };
    }

    public static Specification<Submission> hasCourseId(Long courseId) {
        return (root, query, cb) -> {
            if (courseId == null) {
                return null;
            }
            return cb.equal(root.get("assignment").get("course").get("id"), courseId);
        };
    }

    public static Specification<Submission> hasStudent(User student) {
        return (root, query, cb) -> {
            if (student == null) {
                return null;
            }
            return cb.equal(root.get("student"), student);
        };
    }

    public static Specification<Submission> hasStudentId(Long studentId) {
        return (root, query, cb) -> {
            if (studentId == null) {
                return null;
            }
            return cb.equal(root.get("student").get("id"), studentId);
        };
    }

    public static Specification<Submission> hasStatus(String status) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(status)) {
                return null;
            }
            return cb.equal(root.get("status"), Submission.Status.valueOf(status.toUpperCase()));
        };
    }

    public static Specification<Submission> hasGraded(Boolean graded) {
        return (root, query, cb) -> {
            if (graded == null) {
                return null;
            }
            if (graded) {
                return cb.isNotNull(root.get("gradedBy"));
            }
            return cb.isNull(root.get("gradedBy"));
        };
    }

    public static Specification<Submission> hasSubmittedAfter(LocalDateTime submittedAt) {
        return (root, query, cb) -> {
            if (submittedAt == null) {
                return null;
            }
            return cb.greaterThanOrEqualTo(root.get("submittedAt"), submittedAt);
        };
    }

    public static Specification<Submission> hasSubmittedBefore(LocalDateTime submittedAt) {
        return (root, query, cb) -> {
            if (submittedAt == null) {
                return null;
            }
            return cb.lessThanOrEqualTo(root.get("submittedAt"), submittedAt);
        };
    }
}