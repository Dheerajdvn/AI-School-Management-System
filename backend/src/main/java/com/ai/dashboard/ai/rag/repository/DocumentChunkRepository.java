package com.ai.dashboard.ai.rag.repository;

import com.ai.dashboard.ai.rag.model.DocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentChunkRepository extends JpaRepository<DocumentChunk, Long> {

    List<DocumentChunk> findByDocumentId(Long documentId);

    List<DocumentChunk> findByDocumentIdIn(List<Long> documentIds);

    Optional<DocumentChunk> findByDocumentIdAndChunkIndex(Long documentId, Integer chunkIndex);

    void deleteByDocumentId(Long documentId);

    boolean existsByDocumentIdAndEmbeddingGenerated(Long documentId, boolean embeddingGenerated);
}