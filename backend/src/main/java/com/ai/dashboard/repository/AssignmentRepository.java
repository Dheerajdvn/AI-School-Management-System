package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Repository for Assignment entity with specification support.
 */
@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long>, JpaSpecificationExecutor<Assignment> {

    Page<Assignment> findByCourse(Course course, Pageable pageable);

    Page<Assignment> findByTeacher(User teacher, Pageable pageable);

    Page<Assignment> findByTeacherId(Long teacherId, Pageable pageable);

    long countByTeacherId(Long teacherId);
}
