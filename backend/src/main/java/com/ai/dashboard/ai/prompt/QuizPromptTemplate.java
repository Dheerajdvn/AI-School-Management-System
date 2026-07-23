package com.ai.dashboard.ai.prompt;

import org.springframework.stereotype.Component;

/**
 * Prompt template for AI Quiz Practice functionality.
 */
@Component
public class QuizPromptTemplate implements PromptTemplate {

    private static final String SYSTEM_TEMPLATE = """
            You are an AI Quiz Generator. Create educational quizzes based on the provided context.
            
            Guidelines:
            1. Generate relevant multiple-choice questions
            2. Ensure questions test understanding, not just recall
            3. Provide 4 options (A, B, C, D) with one correct answer
            4. Include explanations for each answer
            5. Vary difficulty levels
            6. Focus on key concepts from the context
            """;

    private static final String GENERATE_TEMPLATE = """
            Context from Course Materials:
            {context}
            
            Number of Questions: {numQuestions}
            Difficulty: {difficulty}
            
            Please generate {numQuestions} multiple-choice questions about the material.
            Format each question as:
            Q1. [Question text]
            A) [Option A]
            B) [Option B]
            C) [Option C]
            D) [Option D]
            Answer: [Correct option letter]
            Explanation: [Why this is correct]
            """;

    private static final String EVALUATE_TEMPLATE = """
            Question: {question}
            Student's Answer: {studentAnswer}
            Correct Answer: {correctAnswer}
            
            Please evaluate the student's answer and provide feedback.
            Explain why the correct answer is right and what misconceptions the student might have.
            """;

    @Override
    public PromptType getType() {
        return PromptType.QUIZ;
    }

    @Override
    public String buildSystemPrompt() {
        return SYSTEM_TEMPLATE;
    }

    @Override
    public String buildUserPrompt(PromptBuildRequest request) {
        Integer numQuestions = request.intVariable("numQuestions");
        return buildGenerateQuizPrompt(
                request.context(),
                numQuestions != null ? numQuestions : 5,
                request.stringVariable("difficulty"));
    }

    public String buildGenerateQuizPrompt(String context, int numQuestions, String difficulty) {
        return GENERATE_TEMPLATE
                .replace("{context}", context != null && !context.isEmpty() ? context : "No context provided")
                .replace("{numQuestions}", String.valueOf(numQuestions))
                .replace("{difficulty}", difficulty != null ? difficulty : "medium");
    }

    public String buildEvaluateAnswerPrompt(String question, String studentAnswer, String correctAnswer) {
        return EVALUATE_TEMPLATE
                .replace("{question}", question)
                .replace("{studentAnswer}", studentAnswer)
                .replace("{correctAnswer}", correctAnswer);
    }
}
