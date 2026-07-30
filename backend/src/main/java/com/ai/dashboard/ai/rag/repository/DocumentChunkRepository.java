package com.ai.dashboard.ai.rag.repository;

import com.ai.dashboard.ai.rag.model.DocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentChunkRepository extends JpaRepository<DocumentChunk, Long> {

    @Query("SELECT c FROM DocumentChunk c WHERE c.document.id = :documentId")
    List<DocumentChunk> findByDocumentId(@Param("documentId") Long documentId);

    @Query("SELECT c FROM DocumentChunk c WHERE c.document.id IN :documentIds")
    List<DocumentChunk> findByDocumentIdIn(@Param("documentIds") List<Long> documentIds);

    @Query("SELECT c FROM DocumentChunk c WHERE c.document.id = :documentId AND c.chunkIndex = :chunkIndex")
    Optional<DocumentChunk> findByDocumentIdAndChunkIndex(@Param("documentId") Long documentId, @Param("chunkIndex") Integer chunkIndex);

    @Modifying
    @Query("DELETE FROM DocumentChunk c WHERE c.document.id = :documentId")
    void deleteByDocumentId(@Param("documentId") Long documentId);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM DocumentChunk c WHERE c.document.id = :documentId AND c.embeddingGenerated = :embeddingGenerated")
    boolean existsByDocumentIdAndEmbeddingGenerated(@Param("documentId") Long documentId, @Param("embeddingGenerated") boolean embeddingGenerated);
}