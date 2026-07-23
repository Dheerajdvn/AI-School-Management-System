package com.ai.dashboard.ai.embedding.service.impl;

import com.ai.dashboard.ai.embedding.provider.EmbeddingProvider;
import com.ai.dashboard.ai.embedding.service.EmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Default implementation of EmbeddingService.
 *
 * <p>Delegates all operations to the configured {@link EmbeddingProvider}.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmbeddingServiceImpl implements EmbeddingService {

    private final EmbeddingProvider embeddingProvider;

    @Override
    public List<Float> generateEmbedding(String text) {
        log.debug("Generating embedding for text (length={})", text.length());
        return embeddingProvider.generateEmbedding(text);
    }

    @Override
    public List<List<Float>> generateEmbeddings(List<String> texts) {
        log.debug("Generating embeddings for {} texts", texts.size());
        return embeddingProvider.generateEmbeddings(texts);
    }

    @Override
    public boolean health() {
        return embeddingProvider.health();
    }
}