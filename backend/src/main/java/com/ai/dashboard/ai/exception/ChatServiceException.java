package com.ai.dashboard.ai.exception;

/**
 * Exception thrown when AI chat operations fail.
 */
public class ChatServiceException extends RuntimeException {

    public ChatServiceException(String message) {
        super(message);
    }

    public ChatServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}