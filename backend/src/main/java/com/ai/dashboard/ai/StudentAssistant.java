package com.ai.dashboard.ai;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * Declarative LangChain4j AI service for the conversational chat feature.
 *
 * <p>Implemented at runtime by {@link dev.langchain4j.service.AiServices}; you
 * just call {@link #chat(String)} and the prompt is wired through the Ollama model.</p>
 */
public interface StudentAssistant {

    @SystemMessage("""
            You are a friendly analytics assistant for an educational institute.
            You help users understand student enrollment, fees, courses and cities.
            Always answer concisely (2-3 sentences) and suggest one concrete question
            they could ask the 'Ask AI' SQL box if they want hard numbers.
            """)
    @UserMessage("{{it}}")
    String chat(String userMessage);
}
