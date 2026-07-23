package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Enrollment;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/**
 * Specifications for Enrollment entity filtering.
 */
public class EnrollmentSpecifications {

    public static Specification<Enrollment> hasStudent(User student) {
        return (root, query, cb) -> {
            if (student == null) {
                return null;
            }
            return cb.equal(root.get("student"), student);
        };
    }

    public static Specification<Enrollment> hasStudentId(Long studentId) {
        return (root, query, cb) -> {
            if (studentId == null) {
                return null;
            }
            return cb.equal(root.get("student").get("id"), studentId);
        };
    }

    public static Specification<Enrollment> hasCourse(Course course) {
        return (root, query, cb) -> {
            if (course == null) {
                return null;
            }
            return cb.equal(root.get("course"), course);
        };
    }

    public static Specification<Enrollment> hasCourseId(Long courseId) {
        return (root, query, cb) -> {
            if (courseId == null) {
                return null;
            }
            return cb.equal(root.get("course").get("id"), courseId);
        };
    }

    public static Specification<Enrollment> hasStatus(String status) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(status)) {
                return null;
            }
            return cb.equal(root.get("status"), Enrollment.Status.valueOf(status.toUpperCase()));
        };
    }
}