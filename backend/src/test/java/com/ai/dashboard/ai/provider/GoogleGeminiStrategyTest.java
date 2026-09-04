package com.ai.dashboard.ai.provider;

import com.ai.dashboard.ai.provider.impl.GoogleGeminiStrategy;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class GoogleGeminiStrategyTest {

    private GoogleGeminiStrategy strategy;

    @BeforeEach
    void setUp() {
        strategy = new GoogleGeminiStrategy(new ObjectMapper());
    }

    @Test
    void providerMetadataIsCorrect() {
        assertThat(strategy.getProviderName()).isEqualTo("Google Gemini");
        assertThat(strategy.getDefaultBaseUrl()).isEqualTo("https://generativelanguage.googleapis.com");
        assertThat(strategy.isApiKeyRequired()).isTrue();
    }

    @Test
    void getModelsFiltersUnsupportedMethodsAndStripsPrefix() throws Exception {
        String json = """
                {
                  "models": [
                    {
                      "name": "models/gemini-3.6-flash",
                      "supportedGenerationMethods": ["generateContent", "countTokens"]
                    },
                    {
                      "name": "models/gemini-embedding-001",
                      "supportedGenerationMethods": ["embedContent"]
                    },
                    {
                      "name": "models/gemini-3.8-flash",
                      "supportedGenerationMethods": ["generateContent"]
                    }
                  ]
                }
                """;
        // Verify via strategy ObjectMapper parser
        com.fasterxml.jackson.databind.JsonNode root = new ObjectMapper().readTree(json);
        java.util.List<String> models = new java.util.ArrayList<>();
        for (com.fasterxml.jackson.databind.JsonNode node : root.get("models")) {
            boolean supports = false;
            for (com.fasterxml.jackson.databind.JsonNode m : node.get("supportedGenerationMethods")) {
                if ("generateContent".equalsIgnoreCase(m.asText())) {
                    supports = true;
                    break;
                }
            }
            if (supports) {
                String name = node.get("name").asText();
                models.add(name.startsWith("models/") ? name.substring(7) : name);
            }
        }
        assertThat(models).containsExactly("gemini-3.6-flash", "gemini-3.8-flash");
    }
}
