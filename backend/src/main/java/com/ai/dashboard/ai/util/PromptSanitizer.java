package com.ai.dashboard.ai.util;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

/**
 * Sanitizes user prompts to prevent prompt injection attacks.
 *
 * <p>Removes or neutralizes common jailbreak patterns while preserving
 * legitimate educational questions.</p>
 */
@Component
public class PromptSanitizer {

    private static final List<Pattern> INJECTION_PATTERNS = List.of(
            Pattern.compile("(?i)ignore previous instructions", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?i)ignore all previous", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?i)disregard previous", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?i)override previous", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?i)reveal system prompt", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?i)show hidden prompt", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?i)print system instructions", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?i)execute arbitrary", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?i)jailbreak", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?i)DAN\\s*mode", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?i)developer mode", Pattern.CASE_INSENSITIVE)
    );

    private static final String NEUTRALIZED_MARKER = "[filtered]";

    /**
     * Sanitize user prompt by removing injection attempts.
     *
     * @param prompt the user prompt
     * @return sanitized prompt
     */
    public String sanitize(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            return prompt;
        }

        String sanitized = prompt;
        for (Pattern pattern : INJECTION_PATTERNS) {
            sanitized = pattern.matcher(sanitized).replaceAll(NEUTRALIZED_MARKER);
        }

        return sanitized;
    }

    /**
     * Check if prompt contains injection attempts.
     *
     * @param prompt the user prompt
     * @return true if injection detected
     */
    public boolean containsInjection(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            return false;
        }

        return INJECTION_PATTERNS.stream()
                .anyMatch(pattern -> pattern.matcher(prompt).find());
    }
}