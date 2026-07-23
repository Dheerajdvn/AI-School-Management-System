package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link Student} entities.
 *
 * <p>Extends {@link JpaSpecificationExecutor} to support dynamic filtering
 * (by name, course, subject, city, fee range, date range) used by the search API.</p>
 */
@Repository
public interface StudentRepository extends
        JpaRepository<Student, Long>,
        JpaSpecificationExecutor<Student> {

    /**
     * Count students grouped by course, ordered by count desc.
     */
    @Query(value = """
            SELECT s.course AS label, COUNT(*) AS value
            FROM student s
            GROUP BY s.course
            ORDER BY value DESC
            """, nativeQuery = true)
    List<LabelValue> countByCourse();

    /**
     * Count students grouped by subject.
     */
    @Query(value = """
            SELECT s.subject AS label, COUNT(*) AS value
            FROM student s
            GROUP BY s.subject
            ORDER BY value DESC
            """, nativeQuery = true)
    List<LabelValue> countBySubject();

    /**
     * Count students grouped by city (address).
     */
    @Query(value = """
            SELECT s.address AS label, COUNT(*) AS value
            FROM student s
            GROUP BY s.address
            ORDER BY value DESC
            """, nativeQuery = true)
    List<LabelValue> countByCity();

    /**
     * Count students grouped by year-month of joining_date.
     */
    @Query(value = """
            SELECT DATE_FORMAT(s.joining_date, '%Y-%m') AS label, COUNT(*) AS value
            FROM student s
            GROUP BY DATE_FORMAT(s.joining_date, '%Y-%m')
            ORDER BY label ASC
            """, nativeQuery = true)
    List<LabelValue> countMonthlyJoining();

    /**
     * Total fees collected across all students.
     */
    @Query("SELECT COALESCE(SUM(s.fee), 0.0) FROM Student s")
    Double totalFees();

    /**
     * Average fee across all students.
     */
    @Query("SELECT COALESCE(AVG(s.fee), 0.0) FROM Student s")
    Double averageFees();

    /**
     * Case-insensitive search across name/course/subject/city.
     */
    Page<Student> findByNameContainingIgnoreCaseOrCourseContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrAddressContainingIgnoreCase(
            String name, String course, String subject, String address, Pageable pageable);

    /**
     * Find students by course (case-insensitive).
     */
    List<Student> findByCourseIgnoreCase(String course);

    /**
     * Projection interface for label/value aggregations.
     */
    interface LabelValue {
        String getLabel();
        Long getValue();
    }
}
