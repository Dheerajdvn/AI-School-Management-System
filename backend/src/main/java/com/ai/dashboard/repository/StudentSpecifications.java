package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Student;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

/**
 * Reusable JPA Specifications for dynamic Student filtering.
 *
 * <p>Each method returns a Specification so the caller can combine several
 * filters with {@code and()} / {@code or()}.</p>
 */
public final class StudentSpecifications {

    private StudentSpecifications() {}

    public static Specification<Student> nameContains(String name) {
        return (root, query, cb) -> name == null || name.isBlank()
                ? cb.conjunction()
                : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Student> courseEquals(String course) {
        return (root, query, cb) -> course == null || course.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("course")), course.toLowerCase());
    }

    public static Specification<Student> subjectEquals(String subject) {
        return (root, query, cb) -> subject == null || subject.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("subject")), subject.toLowerCase());
    }

    public static Specification<Student> cityEquals(String city) {
        return (root, query, cb) -> city == null || city.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("address")), city.toLowerCase());
    }

    public static Specification<Student> feeBetween(Double min, Double max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min == null) return cb.lessThanOrEqualTo(root.get("fee"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("fee"), min);
            return cb.between(root.get("fee"), min, max);
        };
    }

    public static Specification<Student> joiningDateBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return cb.conjunction();
            if (from == null) return cb.lessThanOrEqualTo(root.get("joiningDate"), to);
            if (to == null) return cb.greaterThanOrEqualTo(root.get("joiningDate"), from);
            return cb.between(root.get("joiningDate"), from, to);
        };
    }
}
