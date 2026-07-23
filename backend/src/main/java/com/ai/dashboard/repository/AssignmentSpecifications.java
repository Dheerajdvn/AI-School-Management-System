package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

/**
 * Specifications for Assignment entity filtering.
 */
public class AssignmentSpecifications {

    public static Specification<Assignment> hasCourse(Course course) {
        return (root, query, cb) -> {
            if (course == null) {
                return null;
            }
            return cb.equal(root.get("course"), course);
        };
    }

    public static Specification<Assignment> hasCourseId(Long courseId) {
        return (root, query, cb) -> {
            if (courseId == null) {
                return null;
            }
            return cb.equal(root.get("course").get("id"), courseId);
        };
    }

    public static Specification<Assignment> hasTeacher(User teacher) {
        return (root, query, cb) -> {
            if (teacher == null) {
                return null;
            }
            return cb.equal(root.get("teacher"), teacher);
        };
    }

    public static Specification<Assignment> hasTeacherId(Long teacherId) {
        return (root, query, cb) -> {
            if (teacherId == null) {
                return null;
            }
            return cb.equal(root.get("teacher").get("id"), teacherId);
        };
    }

    public static Specification<Assignment> hasStatus(String status) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(status)) {
                return null;
            }
            return cb.equal(root.get("status"), Assignment.Status.valueOf(status.toUpperCase()));
        };
    }

    public static Specification<Assignment> hasTitle(String title) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(title)) {
                return null;
            }
            return cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
        };
    }

    public static Specification<Assignment> hasDueDateBefore(LocalDateTime dueDate) {
        return (root, query, cb) -> {
            if (dueDate == null) {
                return null;
            }
            return cb.lessThanOrEqualTo(root.get("dueDate"), dueDate);
        };
    }

    public static Specification<Assignment> hasDueDateAfter(LocalDateTime dueDate) {
        return (root, query, cb) -> {
            if (dueDate == null) {
                return null;
            }
            return cb.greaterThanOrEqualTo(root.get("dueDate"), dueDate);
        };
    }
}