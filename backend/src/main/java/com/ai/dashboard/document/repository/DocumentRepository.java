package com.ai.dashboard.document.repository;

import com.ai.dashboard.document.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import java.util.Optional;

/**
 * Repository for Document entity.
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long>, JpaSpecificationExecutor<Document> {

    @EntityGraph(attributePaths = {"uploadedBy", "course"})
    Page<Document> findAll(org.springframework.data.jpa.domain.Specification<Document> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"uploadedBy", "course"})
    Optional<Document> findById(Long id);

    Page<Document> findByCourseId(Long courseId, Pageable pageable);

    Page<Document> findByUploadedById(Long uploadedById, Pageable pageable);

    long countByUploadedById(Long uploadedById);

    long countByProcessingStatus(Document.ProcessingStatus processingStatus);

    long countByProcessingStatusIn(Collection<Document.ProcessingStatus> processingStatuses);

    @Query("SELECT COUNT(DISTINCT d.course.id) FROM Document d WHERE d.course IS NOT NULL")
    long countDistinctCourseWithDocuments();

    @Query("SELECT FUNCTION('DATE', d.uploadTime), COUNT(d) " +
           "FROM Document d " +
           "WHERE d.uploadTime >= :since " +
           "GROUP BY FUNCTION('DATE', d.uploadTime) " +
           "ORDER BY FUNCTION('DATE', d.uploadTime) ASC")
    List<Object[]> countUploadsPerDaySince(@Param("since") LocalDateTime since);

    @Query("SELECT COALESCE(c.title, c.courseCode, 'General'), COUNT(d) " +
           "FROM Document d LEFT JOIN d.course c " +
           "GROUP BY COALESCE(c.title, c.courseCode, 'General') " +
           "ORDER BY COUNT(d) DESC")
    List<Object[]> countDocumentsByCollection();

    @Query("SELECT CASE " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.pdf' THEN 'PDF' " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.docx' OR LOWER(d.originalFilename) LIKE '%.doc' THEN 'DOCX' " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.txt' THEN 'TXT' " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.md' THEN 'MD' " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.ppt%' THEN 'PPT' " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.xls%' THEN 'XLS' " +
           "  ELSE 'OTHER' END, COUNT(d) " +
           "FROM Document d " +
           "GROUP BY CASE " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.pdf' THEN 'PDF' " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.docx' OR LOWER(d.originalFilename) LIKE '%.doc' THEN 'DOCX' " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.txt' THEN 'TXT' " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.md' THEN 'MD' " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.ppt%' THEN 'PPT' " +
           "  WHEN LOWER(d.originalFilename) LIKE '%.xls%' THEN 'XLS' " +
           "  ELSE 'OTHER' END " +
           "ORDER BY COUNT(d) DESC")
    List<Object[]> countDocumentsByType();
}