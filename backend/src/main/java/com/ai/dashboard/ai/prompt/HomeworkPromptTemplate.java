package com.ai.dashboard.ai.prompt;

import org.springframework.stereotype.Component;

/**
 * Prompt template for AI Homework Helper functionality.
 */
@Component
public class HomeworkPromptTemplate implements PromptTemplate {

    private static final String SYSTEM_TEMPLATE = """
            You are an AI Homework Helper. Your role is to guide students through homework problems step-by-step.
            
            Guidelines:
            1. Break down complex problems into manageable steps
            2. Explain each step clearly with reasoning
            3. Ask the student to try before providing the full solution
            4. Check for understanding at each step
            5. Provide hints and guidance, not just answers
            6. Use the provided context when available
            """;

    private static final String PROMPT_TEMPLATE = """
            Subject: {subject}
            
            Problem:
            {problem}
            
            Context from Course Materials:
            {context}
            
            Please help the student solve this problem by:
            1. Identifying the key concepts involved
            2. Breaking it down into steps
            3. Explaining each step with examples
            4. Providing guidance without giving away the final answer immediately
            """;

    private static final String FOLLOWUP_TEMPLATE = """
            Context from Course Materials:
            {context}
            
            Student's attempt:
            {attempt}
            
            Please provide feedback on their approach and guide them toward the correct solution.
            """;

    @Override
    public PromptType getType() {
        return PromptType.HOMEWORK;
    }

    @Override
    public String buildSystemPrompt() {
        return SYSTEM_TEMPLATE;
    }

    @Override
    public String buildUserPrompt(PromptBuildRequest request) {
        return buildPrompt(
                request.stringVariable("subject"),
                request.stringVariable("problem"),
                request.context());
    }

    public String buildPrompt(String subject, String problem, String context) {
        return PROMPT_TEMPLATE
                .replace("{subject}", subject != null ? subject : "General")
                .replace("{problem}", problem)
                .replace("{context}", context != null && !context.isEmpty() ? context : "No specific context provided");
    }

    public String buildFollowUpPrompt(String context, String studentAttempt) {
        return FOLLOWUP_TEMPLATE
                .replace("{context}", context != null && !context.isEmpty() ? context : "No specific context provided")
                .replace("{attempt}", studentAttempt);
    }
}
