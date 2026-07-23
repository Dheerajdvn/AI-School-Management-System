package com.ai.dashboard.exception;

/**
 * Thrown when the AI / LLM layer fails (generation, validation, or execution).
 */
public class AiServiceException extends RuntimeException {
    public AiServiceException(String message) {
        super(message);
    }

    public AiServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
