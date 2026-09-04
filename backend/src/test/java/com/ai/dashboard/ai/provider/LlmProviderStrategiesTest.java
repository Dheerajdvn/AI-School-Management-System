package com.ai.dashboard.ai.provider;

import com.ai.dashboard.ai.provider.impl.AnthropicStrategy;
import com.ai.dashboard.ai.provider.impl.AzureOpenAIStrategy;
import com.ai.dashboard.ai.provider.impl.DeepSeekStrategy;
import com.ai.dashboard.ai.provider.impl.GoogleGeminiStrategy;
import com.ai.dashboard.ai.provider.impl.GroqStrategy;
import com.ai.dashboard.ai.provider.impl.MistralAIStrategy;
import com.ai.dashboard.ai.provider.impl.OllamaStrategy;
import com.ai.dashboard.ai.provider.impl.OpenAIStrategy;
import com.ai.dashboard.ai.provider.impl.OpenRouterStrategy;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LlmProviderStrategiesTest {

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void anthropicStrategyConfiguration() {
        AnthropicStrategy strategy = new AnthropicStrategy(objectMapper);
        assertThat(strategy.getProviderName()).isEqualTo("Anthropic");
        assertThat(strategy.getDefaultBaseUrl()).isEqualTo("https://api.anthropic.com");
        assertThat(strategy.isApiKeyRequired()).isTrue();
    }

    @Test
    void openAiStrategyConfiguration() {
        OpenAIStrategy strategy = new OpenAIStrategy(objectMapper);
        assertThat(strategy.getProviderName()).isEqualTo("OpenAI");
        assertThat(strategy.getDefaultBaseUrl()).isEqualTo("https://api.openai.com");
        assertThat(strategy.isApiKeyRequired()).isTrue();
    }

    @Test
    void groqStrategyConfiguration() {
        GroqStrategy strategy = new GroqStrategy(objectMapper);
        assertThat(strategy.getProviderName()).isEqualTo("Groq");
        assertThat(strategy.getDefaultBaseUrl()).isEqualTo("https://api.groq.com");
        assertThat(strategy.isApiKeyRequired()).isTrue();
    }

    @Test
    void deepSeekStrategyConfiguration() {
        DeepSeekStrategy strategy = new DeepSeekStrategy(objectMapper);
        assertThat(strategy.getProviderName()).isEqualTo("DeepSeek");
        assertThat(strategy.getDefaultBaseUrl()).isEqualTo("https://api.deepseek.com");
        assertThat(strategy.isApiKeyRequired()).isTrue();
    }

    @Test
    void mistralAiStrategyConfiguration() {
        MistralAIStrategy strategy = new MistralAIStrategy(objectMapper);
        assertThat(strategy.getProviderName()).isEqualTo("Mistral AI");
        assertThat(strategy.getDefaultBaseUrl()).isEqualTo("https://api.mistral.ai");
        assertThat(strategy.isApiKeyRequired()).isTrue();
    }

    @Test
    void openRouterStrategyConfiguration() {
        OpenRouterStrategy strategy = new OpenRouterStrategy(objectMapper);
        assertThat(strategy.getProviderName()).isEqualTo("OpenRouter");
        assertThat(strategy.getDefaultBaseUrl()).isEqualTo("https://openrouter.ai");
        assertThat(strategy.isApiKeyRequired()).isTrue();
    }

    @Test
    void azureOpenAiStrategyConfiguration() {
        AzureOpenAIStrategy strategy = new AzureOpenAIStrategy(objectMapper);
        assertThat(strategy.getProviderName()).isEqualTo("Azure OpenAI");
        assertThat(strategy.getDefaultBaseUrl()).isEqualTo("https://your-resource.openai.azure.com");
        assertThat(strategy.isApiKeyRequired()).isTrue();
    }

    @Test
    void ollamaStrategyConfiguration() {
        OllamaStrategy strategy = new OllamaStrategy(objectMapper);
        assertThat(strategy.getProviderName()).isEqualTo("Ollama");
        assertThat(strategy.getDefaultBaseUrl()).isEqualTo("http://localhost:11434");
        assertThat(strategy.isApiKeyRequired()).isFalse();
    }

    @Test
    void googleGeminiStrategyConfiguration() {
        GoogleGeminiStrategy strategy = new GoogleGeminiStrategy(objectMapper);
        assertThat(strategy.getProviderName()).isEqualTo("Google Gemini");
        assertThat(strategy.getDefaultBaseUrl()).isEqualTo("https://generativelanguage.googleapis.com");
        assertThat(strategy.isApiKeyRequired()).isTrue();
    }
}
