package com.ai.dashboard.ai.embedding.exception;

import java.io.Serial;
import java.io.Serializable;

/**
 * Exception thrown when embedding operations fail.
 */
public class EmbeddingException extends RuntimeException implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    public enum ErrorType {
        INVALID_REQUEST,
        MODEL_UNAVAILABLE,
        CONNECTION_REFUSED,
        INVALID_RESPONSE,
        INVALID_VECTOR,
        DIMENSION_MISMATCH,
        TIMEOUT,
        UNKNOWN
    }

    private final ErrorType errorType;

    public EmbeddingException(ErrorType errorType, String message) {
        super(message);
        this.errorType = errorType;
    }

    public EmbeddingException(ErrorType errorType, String message, Throwable cause) {
        super(message, cause);
        this.errorType = errorType;
    }

    public ErrorType getErrorType() {
        return errorType;
    }
}