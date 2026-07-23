package com.ai.dashboard.ai.prompt;

import org.springframework.stereotype.Component;

/**
 * Prompt template for AI Tutor functionality.
 */
@Component
public class TutorPromptTemplate implements PromptTemplate {

    private static final String SYSTEM_TEMPLATE = """
            You are an AI Learning Tutor. Your role is to help students understand concepts, not just provide answers.
            
            Guidelines:
            1. Explain concepts step-by-step with examples
            2. Ask follow-up questions to check understanding
            3. Provide hints rather than direct answers when possible
            4. Adapt your explanation to the student's level
            5. Be patient and encouraging
            6. Use the provided context to inform your responses
            """;

    private static final String CONTEXT_FORMAT = """
            Relevant Context from Course Materials:
            {context}
            """;

    private static final String QUESTION_FORMAT = """
            Student Question:
            {question}
            """;

    private static final String RESPONSE_FORMAT = """
            Please provide a helpful, educational response. If the context doesn't contain enough information,
            acknowledge this and provide a general explanation based on your knowledge.
            """;

    @Override
    public PromptType getType() {
        return PromptType.TUTOR;
    }

    @Override
    public String buildSystemPrompt() {
        return SYSTEM_TEMPLATE;
    }

    @Override
    public String buildUserPrompt(PromptBuildRequest request) {
        return buildContextualPrompt(request.context(), request.stringVariable("question"));
    }

    public String buildContextualPrompt(String context, String question) {
        StringBuilder prompt = new StringBuilder();
        
        if (context != null && !context.isEmpty()) {
            prompt.append(CONTEXT_FORMAT.replace("{context}", context)).append("\n\n");
        }
        
        prompt.append(QUESTION_FORMAT.replace("{question}", question)).append("\n\n");
        prompt.append(RESPONSE_FORMAT);
        
        return prompt.toString();
    }

    public String buildFollowUpPrompt(String previousQuestion, String studentResponse) {
        return "The student previously asked: \"" + previousQuestion + "\" " +
               "and your response was followed by: \"" + studentResponse + "\". " +
               "Continue the tutoring conversation.";
    }
}
