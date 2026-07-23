package com.ai.dashboard.exception;

/**
 * Thrown for client-side input errors.
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
