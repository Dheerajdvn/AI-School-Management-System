package com.ai.dashboard.ai.embedding.provider;

import com.ai.dashboard.ai.embedding.config.EmbeddingProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;

class OllamaEmbeddingProviderTest {

    @Test
    @DisplayName("generateEmbeddings preserves 1-to-1 input index mapping and count even with duplicate texts")
    void testEmbeddingOrderWithDuplicates() {
        EmbeddingProperties properties = new EmbeddingProperties();
        WebClient webClient = WebClient.builder().build();
        ObjectMapper objectMapper = new ObjectMapper();

        OllamaEmbeddingProvider provider = spy(new OllamaEmbeddingProvider(webClient, properties, objectMapper));

        doReturn(List.of(0.1f, 0.2f, 0.3f))
                .when(provider).generateEmbedding(anyString());

        List<String> inputTexts = List.of("apple", "banana", "apple", "cherry", "apple");

        List<List<Float>> result = provider.generateEmbeddings(inputTexts);

        assertThat(result).hasSize(inputTexts.size());
        assertThat(result.get(0)).isEqualTo(List.of(0.1f, 0.2f, 0.3f));
        assertThat(result.get(2)).isEqualTo(List.of(0.1f, 0.2f, 0.3f));
        assertThat(result.get(4)).isEqualTo(List.of(0.1f, 0.2f, 0.3f));
    }
}
