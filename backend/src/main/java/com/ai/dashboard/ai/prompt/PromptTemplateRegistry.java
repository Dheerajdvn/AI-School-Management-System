package com.ai.dashboard.ai.prompt;

import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Central registry for all prompt templates.
 */
@Component
public class PromptTemplateRegistry {

    private final Map<PromptType, PromptTemplate> templates;

    public PromptTemplateRegistry(List<PromptTemplate> promptTemplates) {
        EnumMap<PromptType, PromptTemplate> registered = new EnumMap<>(PromptType.class);
        for (PromptTemplate template : promptTemplates) {
            PromptTemplate previous = registered.put(template.getType(), template);
            if (previous != null) {
                throw new IllegalStateException("Duplicate prompt template registered for " + template.getType());
            }
        }
        this.templates = Map.copyOf(registered);
    }

    public PromptTemplate get(PromptType type) {
        PromptTemplate template = templates.get(type);
        if (template == null) {
            throw new IllegalArgumentException("No prompt template registered for " + type);
        }
        return template;
    }
}
