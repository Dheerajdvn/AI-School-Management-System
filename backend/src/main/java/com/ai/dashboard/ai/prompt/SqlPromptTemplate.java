package com.ai.dashboard.ai.prompt;

import com.ai.dashboard.prompt.PromptTemplates;
import org.springframework.stereotype.Component;

/**
 * Managed adapter for SQL generation prompts.
 */
@Component
public class SqlPromptTemplate implements PromptTemplate {

    @Override
    public PromptType getType() {
        return PromptType.SQL_GENERATOR;
    }

    @Override
    public String buildSystemPrompt() {
        return PromptTemplates.NL2SQL_SYSTEM;
    }

    @Override
    public String buildUserPrompt(PromptBuildRequest request) {
        return PromptTemplates.nl2SqlUser(request.stringVariable("question"));
    }

    public String buildSummaryPrompt(String question, String resultPreview) {
        return PromptTemplates.summariseUser(question, resultPreview);
    }
}
