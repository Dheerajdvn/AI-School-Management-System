package com.ai.dashboard.ai.rag.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Represents a chunk of extracted document text with embedding metadata.
 */
@Entity
@Table(name = "document_chunks", indexes = {
    @Index(name = "idx_docchunk_document", columnList = "document_id"),
    @Index(name = "idx_docchunk_embedding", columnList = "embedding_generated"),
    @Index(name = "idx_docchunk_doc_index", columnList = "document_id, chunk_index")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private com.ai.dashboard.document.entity.Document document;

    public Long getDocumentId() {
        return document != null ? document.getId() : null;
    }

    public void setDocumentId(Long documentId) {
        if (documentId != null) {
            this.document = com.ai.dashboard.document.entity.Document.builder().id(documentId).build();
        } else {
            this.document = null;
        }
    }

    @Column(name = "chunk_index", nullable = false)
    private Integer chunkIndex;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "token_count", nullable = false)
    private Integer tokenCount;

    @Column(name = "embedding_generated", nullable = false)
    @Builder.Default
    private boolean embeddingGenerated = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    public static class DocumentChunkBuilder {
        public DocumentChunkBuilder documentId(Long documentId) {
            if (documentId != null) {
                this.document = com.ai.dashboard.document.entity.Document.builder().id(documentId).build();
            }
            return this;
        }
    }
}