package com.ai.dashboard.document.repository;

import com.ai.dashboard.document.entity.DocumentContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for DocumentContent entity.
 */
@Repository
public interface DocumentContentRepository extends JpaRepository<DocumentContent, Long> {

    Optional<DocumentContent> findByDocumentId(Long documentId);

    void deleteByDocumentId(Long documentId);
}
