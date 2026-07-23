package com.ai.dashboard.ai.rag.service;

import com.ai.dashboard.ai.rag.dto.RagChatResponse;
import com.ai.dashboard.ai.rag.dto.RagChatStreamResponse;

/**
 * Service interface for Retrieval-Augmented Generation.
 */
public interface RagService {

    /**
     * Answer a question using RAG with no course filter.
     *
     * @param question the user question
     * @return the RAG response
     */
    RagChatResponse answerQuestion(String question);

    /**
     * Answer a question using RAG, optionally filtered by course.
     *
     * @param question the user question
     * @param courseId the course ID to filter documents (nullable)
     * @return the RAG response
     */
    RagChatResponse answerQuestion(String question, Long courseId);

    /**
     * Answer a question with streaming response.
     *
     * @param question the user question
     * @param courseId the course ID to filter documents (nullable)
     * @return stream of RAG response chunks
     */
    java.util.stream.Stream<RagChatStreamResponse> answerQuestionStream(String question, Long courseId);

    /**
     * Answer a question within a conversation context.
     *
     * @param question the user question
     * @param courseId the course ID to filter documents (nullable)
     * @param sessionId the conversation session ID
     * @return the RAG response
     */
    RagChatResponse answerQuestionWithContext(String question, Long courseId, String sessionId);

    /**
     * Reindex a single document: chunk, embed, and store in vector DB.
     *
     * @param documentId the document ID
     */
    void reindexDocument(Long documentId);

    /**
     * Reindex all documents in the system.
     */
    void reindexAll();
}
