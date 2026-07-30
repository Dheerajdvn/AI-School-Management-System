package com.ai.dashboard.ai.rag.service;

import com.ai.dashboard.ai.rag.service.impl.RagServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class RagChunkingTest {

    @Test
    @DisplayName("Sliding window chunking generates correct chunks without missing words or endless loops")
    void testSlidingWindowChunking() {
        RagServiceImpl ragService = new RagServiceImpl(null, null, null, null, null, null, null);
        
        // Build document of 700 words (not evenly divisible by CHUNK_SIZE = 500)
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 700; i++) {
            sb.append("word").append(i).append(" ");
        }
        String documentText = sb.toString().trim();

        @SuppressWarnings("unchecked")
        List<String> chunks = (List<String>) ReflectionTestUtils.invokeMethod(ragService, "chunkText", documentText);

        assertThat(chunks).isNotEmpty();
        // Check first chunk starts with word1
        assertThat(chunks.get(0)).startsWith("word1 ");
        // Check last chunk ends with word700
        assertThat(chunks.get(chunks.size() - 1)).endsWith(" word700");
    }

    @Test
    @DisplayName("Short document under chunk size produces exactly one chunk")
    void testShortDocumentSingleChunk() {
        RagServiceImpl ragService = new RagServiceImpl(null, null, null, null, null, null, null);
        String documentText = "This is a short document with only eight words.";

        @SuppressWarnings("unchecked")
        List<String> chunks = (List<String>) ReflectionTestUtils.invokeMethod(ragService, "chunkText", documentText);

        assertThat(chunks).hasSize(1);
        assertThat(chunks.get(0)).isEqualTo(documentText);
    }
}
