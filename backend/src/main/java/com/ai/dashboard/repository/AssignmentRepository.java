package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.EntityGraph;
import java.util.Optional;

/**
 * Repository for Assignment entity with specification support.
 */
@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long>, JpaSpecificationExecutor<Assignment> {

    @EntityGraph(attributePaths = {"course", "teacher"})
    Page<Assignment> findAll(org.springframework.data.jpa.domain.Specification<Assignment> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"course", "teacher"})
    Optional<Assignment> findById(Long id);

    Page<Assignment> findByCourse(Course course, Pageable pageable);

    Page<Assignment> findByTeacher(User teacher, Pageable pageable);

    Page<Assignment> findByTeacherId(Long teacherId, Pageable pageable);

    long countByTeacherId(Long teacherId);
}
