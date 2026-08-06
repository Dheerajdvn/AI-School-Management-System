package com.ai.dashboard.ai.vector.service.impl;

import com.ai.dashboard.ai.vector.dto.SearchResult;
import com.ai.dashboard.ai.vector.dto.StoredDocument;
import com.ai.dashboard.ai.vector.provider.VectorStoreProvider;
import com.ai.dashboard.ai.vector.service.VectorStoreService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Default implementation of VectorStoreService.
 *
 * <p>Delegates all operations to the configured {@link VectorStoreProvider}
 * and ensures the collection is created on startup.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VectorStoreServiceImpl implements VectorStoreService {

    private final VectorStoreProvider vectorStoreProvider;

    @PostConstruct
    public void init() {
        log.info("Initializing vector store collection asynchronously");
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                createCollection();
            } catch (Exception e) {
                log.warn("Async vector store collection initialization failed: {}", e.getMessage());
            }
        });
    }

    @Override
    public void createCollection() {
        vectorStoreProvider.createCollection();
    }

    @Override
    public void storeEmbedding(StoredDocument document) {
        log.debug("Storing embedding for document {} chunk {}", document.getDocumentId(), document.getChunkId());
        vectorStoreProvider.upsert(document);
    }

    @Override
    public void storeEmbeddings(List<StoredDocument> documents) {
        log.debug("Storing {} embeddings", documents.size());
        for (StoredDocument doc : documents) {
            vectorStoreProvider.upsert(doc);
        }
    }

    @Override
    public List<SearchResult> searchSimilar(List<Float> embedding, int topK) {
        return searchSimilar(embedding, topK, null);
    }

    @Override
    public List<SearchResult> searchSimilar(List<Float> embedding, int topK, Long courseId) {
        log.debug("Searching similar vectors (topK={}, courseId={})", topK, courseId);
        return vectorStoreProvider.search(embedding, topK, courseId);
    }

    @Override
    public void deleteDocumentVectors(long documentId) {
        log.debug("Deleting vectors for document {}", documentId);
        vectorStoreProvider.delete(documentId);
    }

    @Override
    public boolean health() {
        return vectorStoreProvider.health();
    }
}