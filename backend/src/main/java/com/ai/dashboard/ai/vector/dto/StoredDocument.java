package com.ai.dashboard.ai.vector.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Represents a document chunk with its embedding vector and metadata
 * to be stored in the vector store.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoredDocument {

    /** Unique point ID in the vector store. */
    private String pointId;

    /** The embedding vector. */
    private List<Float> vector;

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

    /** Document type (LECTURE_NOTES, ASSIGNMENT, REFERENCE, SYLLABUS, OTHER). */
    private String documentType;
}