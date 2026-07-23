package com.ai.dashboard.ai.prompt;

import java.util.Objects;

/**
 * In-code prompt version marker for future prompt evolution.
 */
public record PromptVersion(String value) {

    public static final PromptVersion V1 = new PromptVersion("v1");

    public PromptVersion {
        Objects.requireNonNull(value, "value must not be null");
        if (value.isBlank()) {
            throw new IllegalArgumentException("Prompt version must not be blank");
        }
    }
}
