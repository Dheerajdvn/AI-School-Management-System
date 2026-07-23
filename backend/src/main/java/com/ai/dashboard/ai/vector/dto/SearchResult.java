package com.ai.dashboard.ai.vector.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a single search result from the vector store.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult {

    /** Similarity score (higher is more similar). */
    private double score;

    /** Source document ID. */
    private long documentId;

    /** Chunk index within the document. */
    private int chunkId;

    /** Original filename. */
    private String filename;

    /** Course ID this document belongs to (nullable). */
    private Long courseId;

    /** ID of the user who uploaded the document. */
    private long uploadedBy;

    /** Document type. */
    private String documentType;
}