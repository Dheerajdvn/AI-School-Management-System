package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/**
 * Specifications for Course entity filtering.
 */
public class CourseSpecifications {

    public static Specification<Course> hasTitle(String title) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(title)) {
                return null;
            }
            return cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
        };
    }

    public static Specification<Course> hasStatus(String status) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(status)) {
                return null;
            }
            return cb.equal(root.get("status"), Course.Status.valueOf(status.toUpperCase()));
        };
    }

    public static Specification<Course> hasTeacher(User teacher) {
        return (root, query, cb) -> {
            if (teacher == null) {
                return null;
            }
            return cb.equal(root.get("teacher"), teacher);
        };
    }

    public static Specification<Course> hasTeacherId(Long teacherId) {
        return (root, query, cb) -> {
            if (teacherId == null) {
                return null;
            }
            return cb.equal(root.get("teacher").get("id"), teacherId);
        };
    }

    public static Specification<Course> hasCourseCode(String courseCode) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(courseCode)) {
                return null;
            }
            return cb.like(cb.lower(root.get("courseCode")), "%" + courseCode.toLowerCase() + "%");
        };
    }
}