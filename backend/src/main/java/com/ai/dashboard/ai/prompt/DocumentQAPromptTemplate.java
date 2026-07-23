package com.ai.dashboard.ai.prompt;

import org.springframework.stereotype.Component;

/**
 * Prompt template for AI Document QA functionality.
 */
@Component
public class DocumentQAPromptTemplate implements PromptTemplate {

    private static final String SYSTEM_TEMPLATE = """
            You are an AI Document Question Answering assistant. Answer questions based on document content.
            
            Guidelines:
            1. Only answer based on the provided document context
            2. Cite specific document sections when relevant
            3. If information is not in the document, clearly state that
            4. Provide clear, concise answers
            5. Include page or section references when available
            6. Do not hallucinate or invent information
            """;

    private static final String PROMPT_TEMPLATE = """
            Document Context:
            {context}
            
            Question:
            {question}
            
            Please answer the question using ONLY the information from the document above.
            If the answer cannot be found in the context, respond with:
            "The answer is not available in the provided document."
            
            Include citations in the format [Document: filename, Section/Page: reference] where applicable.
            """;

    private static final String FOLLOWUP_TEMPLATE = """
            Previous Question: {previousQuestion}
            Previous Answer: {previousAnswer}
            
            Follow-up Question:
            {followUpQuestion}
            
            Document Context:
            {context}
            
            Please answer considering the conversation history.
            """;

    @Override
    public PromptType getType() {
        return PromptType.DOCUMENT_QA;
    }

    @Override
    public String buildSystemPrompt() {
        return SYSTEM_TEMPLATE;
    }

    @Override
    public String buildUserPrompt(PromptBuildRequest request) {
        return buildPrompt(request.context(), request.stringVariable("question"));
    }

    public String buildPrompt(String context, String question) {
        return PROMPT_TEMPLATE
                .replace("{context}", context != null && !context.isEmpty() ? context : "No context provided")
                .replace("{question}", question);
    }

    public String buildFollowUpPrompt(String previousQuestion, String previousAnswer, String followUpQuestion, String context) {
        return FOLLOWUP_TEMPLATE
                .replace("{previousQuestion}", previousQuestion)
                .replace("{previousAnswer}", previousAnswer)
                .replace("{followUpQuestion}", followUpQuestion)
                .replace("{context}", context != null && !context.isEmpty() ? context : "No context provided");
    }
}
