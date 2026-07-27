package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Submission;
import com.ai.dashboard.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Submission entity with specification support.
 */
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long>, JpaSpecificationExecutor<Submission> {

    Page<Submission> findByAssignment(Assignment assignment, Pageable pageable);

    Page<Submission> findByStudent(User student, Pageable pageable);

    Optional<Submission> findByAssignmentAndStudent(Assignment assignment, User student);

    boolean existsByAssignmentAndStudent(Assignment assignment, User student);

    long countByStudentId(Long studentId);
}