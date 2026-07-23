package com.ai.dashboard.ai;

import com.ai.dashboard.config.OllamaProperties;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.ollama.OllamaLanguageModel;
import dev.langchain4j.service.AiServices;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configures LangChain4j beans that point at the local Ollama server.
 *
 * <p>Both a raw {@link dev.langchain4j.model.chat.ChatLanguageModel} (used for
 * free-form chat) and a high-level {@link StudentAssistant} AiService (declarative
 * prompt-driven interface) are exposed.</p>
 */
@Configuration
public class AiModelConfig {

    @Bean
    public OllamaChatModel ollamaChatModel(OllamaProperties props) {
        return OllamaChatModel.builder()
                .baseUrl(props.getBaseUrl())
                .modelName(props.getModel())
                .temperature(props.getTemperature())
                .timeout(Duration.ofSeconds(props.getTimeout()))
                .build();
    }

    @Bean
    public OllamaLanguageModel ollamaLanguageModel(OllamaProperties props) {
        return OllamaLanguageModel.builder()
                .baseUrl(props.getBaseUrl())
                .modelName(props.getModel())
                .temperature(props.getTemperature())
                .timeout(Duration.ofSeconds(props.getTimeout()))
                .build();
    }

    /**
     * Declarative AiService used for the conversational chat page.
     */
    @Bean
    public StudentAssistant studentAssistant(OllamaChatModel chatModel) {
        return AiServices.builder(StudentAssistant.class)
                .chatLanguageModel(chatModel)
                .build();
    }
}
