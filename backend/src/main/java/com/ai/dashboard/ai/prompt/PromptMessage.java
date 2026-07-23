package com.ai.dashboard.ai.prompt;

/**
 * Fully assembled system and user prompts.
 */
public record PromptMessage(String systemPrompt, String userPrompt, PromptType type, PromptVersion version) {
}
