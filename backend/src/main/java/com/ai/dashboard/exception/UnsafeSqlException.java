package com.ai.dashboard.exception;

/**
 * Thrown when the LLM produces SQL that fails safety validation.
 */
public class UnsafeSqlException extends RuntimeException {
    public UnsafeSqlException(String message) {
        super(message);
    }
}
