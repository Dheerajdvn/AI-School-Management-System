package com.ai.dashboard.ai.exception;

import java.io.Serial;
import java.io.Serializable;

/**
 * Base exception for all AI service errors.
 */
public class AIException extends RuntimeException implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    public enum ErrorType {
        MODEL_UNAVAILABLE,
        TIMEOUT,
        CONNECTION_REFUSED,
        INVALID_REQUEST,
        RATE_LIMIT,
        UNKNOWN
    }

    private final ErrorType errorType;

    public AIException(ErrorType errorType, String message) {
        super(message);
        this.errorType = errorType;
    }

    public AIException(ErrorType errorType, String message, Throwable cause) {
        super(message, cause);
        this.errorType = errorType;
    }

    public ErrorType getErrorType() {
        return errorType;
    }
}