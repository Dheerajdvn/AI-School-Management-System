package com.ai.dashboard.ai.prompt;

import java.util.List;
import java.util.Map;

/**
 * Provider-neutral prompt construction request.
 */
public record PromptBuildRequest(
        PromptType type,
        PromptVersion version,
        Map<String, Object> variables,
        String context,
        List<String> memory,
        List<String> retrievedDocuments) {

    public PromptBuildRequest {
        version = version != null ? version : PromptVersion.V1;
        variables = variables != null ? Map.copyOf(variables) : Map.of();
        memory = memory != null ? List.copyOf(memory) : List.of();
        retrievedDocuments = retrievedDocuments != null ? List.copyOf(retrievedDocuments) : List.of();
    }

    public static Builder builder(PromptType type) {
        return new Builder(type);
    }

    public Object variable(String name) {
        return variables.get(name);
    }

    public String stringVariable(String name) {
        Object value = variable(name);
        return value != null ? String.valueOf(value) : null;
    }

    public Integer intVariable(String name) {
        Object value = variable(name);
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value != null) {
            return Integer.parseInt(String.valueOf(value));
        }
        return null;
    }

    public static final class Builder {
        private final PromptType type;
        private PromptVersion version = PromptVersion.V1;
        private Map<String, Object> variables = Map.of();
        private String context;
        private List<String> memory = List.of();
        private List<String> retrievedDocuments = List.of();

        private Builder(PromptType type) {
            this.type = type;
        }

        public Builder version(PromptVersion version) {
            this.version = version;
            return this;
        }

        public Builder variables(Map<String, Object> variables) {
            this.variables = variables;
            return this;
        }

        public Builder context(String context) {
            this.context = context;
            return this;
        }

        public Builder memory(List<String> memory) {
            this.memory = memory;
            return this;
        }

        public Builder retrievedDocuments(List<String> retrievedDocuments) {
            this.retrievedDocuments = retrievedDocuments;
            return this;
        }

        public PromptBuildRequest build() {
            return new PromptBuildRequest(type, version, variables, context, memory, retrievedDocuments);
        }
    }
}
