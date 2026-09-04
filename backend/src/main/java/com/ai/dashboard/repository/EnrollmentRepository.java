package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Enrollment;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;

/**
 * Repository for Enrollment entity with specification support.
 */
@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long>, JpaSpecificationExecutor<Enrollment> {

    @EntityGraph(attributePaths = {"student", "course"})
    Page<Enrollment> findAll(org.springframework.data.jpa.domain.Specification<Enrollment> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"student", "course"})
    Optional<Enrollment> findById(Long id);

    Optional<Enrollment> findByStudentAndCourse(User student, Course course);

    boolean existsByStudentAndCourse(User student, Course course);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    Page<Enrollment> findByStudent(User student, Pageable pageable);

    Page<Enrollment> findByStudentId(Long studentId, Pageable pageable);

    Page<Enrollment> findByCourse(Course course, Pageable pageable);

    long countByStudentId(Long studentId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COALESCE(c.title, c.courseCode), COUNT(e) " +
        "FROM Course c LEFT JOIN Enrollment e ON e.course.id = c.id " +
        "GROUP BY c.id, c.title, c.courseCode " +
        "ORDER BY COUNT(e) DESC"
    )
    java.util.List<Object[]> countEnrollmentsGroupByCourse();

    @org.springframework.data.jpa.repository.Query(value = """
        SELECT EXTRACT(YEAR FROM e.enrollment_date), EXTRACT(MONTH FROM e.enrollment_date), COUNT(e.id)
        FROM enrollments e
        WHERE e.enrollment_date >= :startDate
        GROUP BY EXTRACT(YEAR FROM e.enrollment_date), EXTRACT(MONTH FROM e.enrollment_date)
        """, nativeQuery = true
    )
    java.util.List<Object[]> countEnrollmentsMonthly(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate);
}
