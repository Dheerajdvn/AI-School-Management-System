package com.ai.dashboard.ai.prompt;

import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Single entry point for building managed prompts.
 */
@Component
public class PromptBuilder {

    private final PromptTemplateRegistry registry;

    public PromptBuilder(PromptTemplateRegistry registry) {
        this.registry = registry;
    }

    public PromptMessage build(PromptBuildRequest request) {
        PromptTemplate template = registry.get(request.type());
        PromptBuildRequest mergedRequest = mergeRequest(request);
        return new PromptMessage(
                template.buildSystemPrompt(),
                template.buildUserPrompt(mergedRequest),
                template.getType(),
                template.getVersion());
    }

    public String buildSystemPrompt(PromptType type) {
        return registry.get(type).buildSystemPrompt();
    }

    public String buildUserPrompt(PromptBuildRequest request) {
        return registry.get(request.type()).buildUserPrompt(mergeRequest(request));
    }

    private PromptBuildRequest mergeRequest(PromptBuildRequest request) {
        String mergedContext = mergeContext(
                request.context(),
                request.memory(),
                request.retrievedDocuments());

        if (mergedContext == null || mergedContext.isBlank()) {
            return request;
        }

        return new PromptBuildRequest(
                request.type(),
                request.version(),
                request.variables(),
                mergedContext,
                request.memory(),
                request.retrievedDocuments());
    }

    private String mergeContext(String context, List<String> memory, List<String> retrievedDocuments) {
        StringBuilder merged = new StringBuilder();
        appendSection(merged, context);
        appendSection(merged, formatSection("Conversation Memory", memory));
        appendSection(merged, formatSection("Retrieved Documents", retrievedDocuments));
        return merged.toString();
    }

    private void appendSection(StringBuilder target, String value) {
        if (value == null || value.isBlank()) {
            return;
        }
        if (!target.isEmpty()) {
            target.append("\n\n");
        }
        target.append(value);
    }

    private String formatSection(String title, List<String> values) {
        if (values == null || values.isEmpty()) {
            return "";
        }
        StringBuilder section = new StringBuilder(title).append(":\n");
        for (int i = 0; i < values.size(); i++) {
            section.append(i + 1).append(". ").append(values.get(i));
            if (i < values.size() - 1) {
                section.append("\n");
            }
        }
        return section.toString();
    }
}
