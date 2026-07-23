package com.ai.dashboard.ai.rag.exception;

/**
 * Exception thrown when RAG operations fail.
 */
public class RagException extends RuntimeException {

    public RagException(String message) {
        super(message);
    }

    public RagException(String message, Throwable cause) {
        super(message, cause);
    }
}