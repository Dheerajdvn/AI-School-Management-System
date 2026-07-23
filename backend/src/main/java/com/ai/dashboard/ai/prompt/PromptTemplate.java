package com.ai.dashboard.ai.prompt;

/**
 * Common contract for all managed prompt templates.
 */
public interface PromptTemplate {

    PromptType getType();

    default PromptVersion getVersion() {
        return PromptVersion.V1;
    }

    String buildSystemPrompt();

    String buildUserPrompt(PromptBuildRequest request);
}
