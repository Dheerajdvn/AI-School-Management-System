package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Course entity with specification support.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {

    Optional<Course> findByCourseCode(String courseCode);

    boolean existsByCourseCode(String courseCode);

    Page<Course> findByStatus(Course.Status status, Pageable pageable);

    Page<Course> findByTeacher(User teacher, Pageable pageable);

    Long countByTeacherId(Long teacherId);

    List<Course> findByTeacherId(Long teacherId);

    Long countByTeacherIdAndStatus(Long teacherId, Course.Status status);

    Long countByTeacherIdAndStatusNot(Long teacherId, Course.Status status);
}