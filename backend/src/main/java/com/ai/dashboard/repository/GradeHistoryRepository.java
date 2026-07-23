package com.ai.dashboard.repository;

import com.ai.dashboard.entity.GradeHistory;
import com.ai.dashboard.entity.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for GradeHistory entity.
 */
@Repository
public interface GradeHistoryRepository extends JpaRepository<GradeHistory, Long> {

    Page<GradeHistory> findBySubmission(Submission submission, Pageable pageable);
}