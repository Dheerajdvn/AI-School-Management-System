package com.ai.dashboard.ai.rag.service.impl;

import com.ai.dashboard.ai.embedding.service.EmbeddingService;
import com.ai.dashboard.ai.rag.dto.RagChatResponse;
import com.ai.dashboard.ai.rag.dto.RagChatStreamResponse;
import com.ai.dashboard.ai.rag.dto.RagSource;
import com.ai.dashboard.ai.rag.exception.RagException;
import com.ai.dashboard.ai.rag.model.ChatMessage;
import com.ai.dashboard.ai.rag.model.ConversationSession;
import com.ai.dashboard.ai.rag.model.DocumentChunk;
import com.ai.dashboard.ai.rag.repository.ChatMessageRepository;
import com.ai.dashboard.ai.rag.repository.ConversationSessionRepository;
import com.ai.dashboard.ai.rag.repository.DocumentChunkRepository;
import com.ai.dashboard.ai.rag.service.RagService;
import com.ai.dashboard.ai.vector.dto.SearchResult;
import com.ai.dashboard.ai.vector.dto.StoredDocument;
import com.ai.dashboard.ai.vector.service.VectorStoreService;
import com.ai.dashboard.config.OllamaProperties;
import com.ai.dashboard.document.entity.Document;
import com.ai.dashboard.document.entity.DocumentContent;
import com.ai.dashboard.document.repository.DocumentContentRepository;
import com.ai.dashboard.document.repository.DocumentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.*;

import com.ai.dashboard.ai.rag.dto.RagChatRequest;
import com.ai.dashboard.ai.dto.ChatRequest;
import com.ai.dashboard.ai.rag.service.ConversationService;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * Implementation of RAG pipeline: chunking, embedding, vector search, and answer generation.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RagServiceImpl implements RagService {

    private static final int CHUNK_SIZE = 750; // words
    private static final int CHUNK_OVERLAP = 100; // words
    private static final int TOP_K = 5;

    private final DocumentRepository documentRepository;
    private final DocumentContentRepository documentContentRepository;
    private final DocumentChunkRepository documentChunkRepository;
    private final EmbeddingService embeddingService;
    private final VectorStoreService vectorStoreService;
    private final com.ai.dashboard.ai.service.AIService aiService;
    private final ConversationService conversationService;

    @PostConstruct
    public void init() {
        log.info("RAG service initialized");
    }

    @Override
    public RagChatResponse answerQuestion(String question) {
        return answerQuestion(question, null);
    }

    @Override
    public RagChatResponse answerQuestionWithContext(String question, Long courseId, String sessionId) {
        // For now, delegate to standard answerQuestion - full implementation would include
        // conversation history retrieval and response storage
        return answerQuestion(question, courseId);
    }

    @Override
    public Stream<RagChatStreamResponse> answerQuestionStream(String question, Long courseId) {
        // For now, return a single-item stream - full implementation would stream tokens
        RagChatResponse response = answerQuestion(question, courseId);
        return Stream.of(RagChatStreamResponse.builder()
                .content(response.getAnswer())
                .complete(true)
                .sources(response.getSources())
                .responseTimeMs(response.getResponseTime())
                .confidenceScore(response.getConfidenceScore())
                .build());
    }

    @Override
    public void answerQuestionStreamSse(RagChatRequest request, SseEmitter emitter, Long userId) {
        long startTime = System.currentTimeMillis();
        String question = request.getQuestion();
        Long courseId = request.getCourseId();
        String sessionId = request.getSessionId();

        log.info("RAG SSE streaming started: questionLength={}, courseId={}, userId={}, sessionId={}",
                question.length(), courseId, userId, sessionId);

        try {
            // 1. Session resolution & User message persistence
            if (sessionId == null || sessionId.isBlank()) {
                String title = question.length() > 30 ? question.substring(0, 30) + "..." : question;
                sessionId = conversationService.createSession(userId != null ? userId : 1L, title);
            }
            conversationService.addMessage(sessionId, ChatMessage.Role.USER, question, null);

            // 2. Vector search & deduplication
            List<Float> questionEmbedding = embeddingService.generateEmbedding(question);
            List<SearchResult> searchResults = vectorStoreService.searchSimilar(questionEmbedding, TOP_K, courseId);
            log.info("Vector search completed: retrieved {} matching chunks", searchResults.size());

            // Deduplicate chunks
            List<SearchResult> deduplicated = new ArrayList<>();
            Set<String> seen = new HashSet<>();
            for (SearchResult r : searchResults) {
                String key = r.getDocumentId() + "_" + r.getChunkId();
                if (seen.add(key)) {
                    deduplicated.add(r);
                }
            }

            // Fallback check if searchResults are empty or relevance score is low (< 0.20)
            if (deduplicated.isEmpty() || searchResults.get(0).getScore() < 0.20) {
                String fallbackText = "I couldn't find relevant information in the uploaded documents.";
                log.info("RAG fallback triggered (no relevant document context found)");

                emitter.send(SseEmitter.event().name("sources").data(Collections.emptyList()));
                emitter.send(SseEmitter.event().name("token").data(fallbackText));
                emitter.send(SseEmitter.event().name("done").data(Map.of(
                        "sessionId", sessionId,
                        "sources", Collections.emptyList(),
                        "answer", fallbackText
                )));
                emitter.complete();

                conversationService.addMessage(sessionId, ChatMessage.Role.ASSISTANT, fallbackText, "No context found");
                return;
            }

            // 3. Batch retrieve chunk text
            List<Long> docIds = deduplicated.stream().map(SearchResult::getDocumentId).distinct().toList();
            List<DocumentChunk> allChunks = docIds.isEmpty() ? Collections.emptyList() : documentChunkRepository.findByDocumentIdIn(docIds);

            Map<String, String> chunkTextMap = allChunks.stream()
                    .collect(Collectors.toMap(
                            c -> c.getDocumentId() + "_" + c.getChunkIndex(),
                            DocumentChunk::getContent,
                            (existing, replacement) -> existing
                    ));

            List<String> retrievedChunks = new ArrayList<>();
            List<RagSource> sources = new ArrayList<>();
            for (SearchResult r : deduplicated) {
                String chunkText = chunkTextMap.getOrDefault(r.getDocumentId() + "_" + r.getChunkId(), "[Chunk content unavailable]");
                retrievedChunks.add(chunkText);
                String ref = (r.getFilename() != null ? r.getFilename() : "Document #" + r.getDocumentId()) + " (Chunk " + r.getChunkId() + ")";
                sources.add(RagSource.builder()
                        .documentId(r.getDocumentId())
                        .filename(r.getFilename() != null ? r.getFilename() : "Document #" + r.getDocumentId())
                        .chunkId(r.getChunkId())
                        .score(r.getScore())
                        .reference(ref)
                        .build());
            }

            // Send sources metadata event via SSE
            emitter.send(SseEmitter.event().name("sources").data(sources));

            // 4. Construct Prompt
            List<ChatMessage> history = conversationService.getSessionHistory(sessionId);
            String historyText = history.stream()
                    .limit(6)
                    .map(m -> m.getRole() + ": " + m.getContent())
                    .collect(Collectors.joining("\n"));

            String contextText = buildContext(retrievedChunks);
            String prompt = "You are an AI learning assistant.\n\n" +
                    "Conversation History:\n" + historyText + "\n\n" +
                    "Context:\n" + contextText + "\n\n" +
                    "Question: " + question + "\n\n" +
                    "Answer strictly using the provided context. If not found, say you couldn't find relevant information.\nAnswer:";

            log.info("Prompt constructed for SSE stream (size={} chars)", prompt.length());

            // 5. Stream Tokens
            StringBuilder fullAnswer = new StringBuilder();
            ChatRequest chatReq = new ChatRequest();
            chatReq.setMessage(prompt);
            chatReq.setConversationId(sessionId);

            Stream<String> tokenStream = aiService.streamChat(chatReq);
            tokenStream.forEach(token -> {
                try {
                    fullAnswer.append(token);
                    emitter.send(SseEmitter.event().name("token").data(token));
                } catch (Exception ex) {
                    log.warn("Failed to push SSE token: {}", ex.getMessage());
                }
            });

            long latency = System.currentTimeMillis() - startTime;
            log.info("RAG SSE streaming finished for sessionId={}, totalChars={}, latency={}ms",
                    sessionId, fullAnswer.length(), latency);

            String finalAnswer = fullAnswer.length() > 0 ? fullAnswer.toString() : "I couldn't find relevant information in the uploaded documents.";

            emitter.send(SseEmitter.event().name("done").data(Map.of(
                    "sessionId", sessionId,
                    "sources", sources,
                    "latencyMs", latency
            )));
            emitter.complete();

            conversationService.addMessage(sessionId, ChatMessage.Role.ASSISTANT, finalAnswer, contextText);

        } catch (Exception e) {
            long elapsed = System.currentTimeMillis() - startTime;
            log.error("RAG SSE streaming failed after {}ms: {}", elapsed, e.getMessage(), e);
            try {
                emitter.send(SseEmitter.event().name("error").data("RAG SSE Pipeline Error: " + e.getMessage()));
                emitter.completeWithError(e);
            } catch (Exception inner) {
                // ignore
            }
        }
    }

    @Override
    public RagChatResponse answerQuestion(String question, Long courseId) {
        Instant start = Instant.now();
        log.info("RAG chat started (question length={}, courseId={})", question.length(), courseId);

        try {
            List<Float> questionEmbedding = embeddingService.generateEmbedding(question);
            log.info("Question embedding generated (dimension={})", questionEmbedding.size());

            List<SearchResult> searchResults = vectorStoreService.searchSimilar(questionEmbedding, TOP_K, courseId);
            log.info("Vector search returned {} results", searchResults.size());

            // Deduplicate chunks preserving similarity score order
            List<SearchResult> deduplicated = new ArrayList<>();
            Set<String> seen = new HashSet<>();
            for (SearchResult r : searchResults) {
                String key = r.getDocumentId() + "_" + r.getChunkId();
                if (seen.add(key)) {
                    deduplicated.add(r);
                }
            }

            // Batch retrieve chunk texts from database to avoid N+1 queries
            List<Long> docIds = deduplicated.stream().map(SearchResult::getDocumentId).distinct().toList();
            List<DocumentChunk> allChunks = docIds.isEmpty() ? Collections.emptyList() : documentChunkRepository.findByDocumentIdIn(docIds);

            Map<String, String> chunkTextMap = allChunks.stream()
                    .collect(Collectors.toMap(
                            c -> c.getDocumentId() + "_" + c.getChunkIndex(),
                            DocumentChunk::getContent,
                            (existing, replacement) -> existing
                    ));

            List<String> retrievedChunks = new ArrayList<>();
            List<RagSource> sources = new ArrayList<>();
            for (SearchResult r : deduplicated) {
                String chunkText = chunkTextMap.getOrDefault(r.getDocumentId() + "_" + r.getChunkId(), "[Chunk content not available]");
                retrievedChunks.add(chunkText);
                sources.add(RagSource.builder()
                        .documentId(r.getDocumentId())
                        .filename(r.getFilename())
                        .chunkId(r.getChunkId())
                        .score(r.getScore())
                        .build());
            }

            String context = buildContext(retrievedChunks);
            String prompt = buildPrompt(context, question);
            log.info("Built RAG prompt (size={} chars)", prompt.length());

            String answer = aiService.chat(new com.ai.dashboard.ai.dto.ChatRequest(prompt, null, courseId)).getAnswer();

            long responseTime = java.time.Duration.between(start, Instant.now()).toMillis();
            double confidence = searchResults.isEmpty() ? 0.0 : searchResults.get(0).getScore();

            log.info("RAG chat completed (responseTime={}ms, confidence={})", responseTime, confidence);

            return RagChatResponse.builder()
                    .answer(answer)
                    .sources(sources)
                    .confidenceScore(confidence)
                    .retrievedChunks(retrievedChunks)
                    .responseTime(responseTime)
                    .build();

        } catch (Exception e) {
            long elapsed = java.time.Duration.between(start, Instant.now()).toMillis();
            log.error("RAG chat failed after {}ms: {}", elapsed, e.getMessage(), e);
            throw new RagException("RAG pipeline failed: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void reindexDocument(Long documentId) {
        log.info("Reindexing document {}", documentId);

        try {
            DocumentContent content = documentContentRepository.findByDocumentId(documentId)
                    .orElseThrow(() -> new RagException("Document content not found for document: " + documentId));

            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new RagException("Document not found: " + documentId));

            documentChunkRepository.deleteByDocumentId(documentId);
            log.info("Deleted existing chunks for document {}", documentId);

            List<String> chunks = chunkText(content.getExtractedText());
            log.info("Generated {} chunks for document {}", chunks.size(), documentId);

            int chunkIndex = 0;
            for (String chunkText : chunks) {
                int tokenCount = estimateTokenCount(chunkText);
                DocumentChunk chunk = DocumentChunk.builder()
                        .documentId(documentId)
                        .chunkIndex(chunkIndex)
                        .content(chunkText)
                        .tokenCount(tokenCount)
                        .embeddingGenerated(false)
                        .build();
                documentChunkRepository.save(chunk);
                chunkIndex++;
            }

            embedAndStoreChunks(documentId, document);
            log.info("Reindex completed for document {}", documentId);
        } catch (Exception e) {
            log.error("Reindex failed for document {}: {}", documentId, e.getMessage(), e);
            throw new RagException("Failed to reindex document: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void reindexAll() {
        log.info("Reindexing all documents");

        List<Document> documents = documentRepository.findAll();
        log.info("Found {} documents to reindex", documents.size());

        for (Document doc : documents) {
            try {
                reindexDocument(doc.getId());
            } catch (Exception e) {
                log.warn("Failed to reindex document {}: {}", doc.getId(), e.getMessage());
            }
        }

        log.info("Reindex all completed");
    }

    // ------------------------------------------------------------------
    // Chunking
    // ------------------------------------------------------------------

    private List<String> chunkText(String text) {
        List<String> chunks = new ArrayList<>();
        if (text == null || text.isBlank()) {
            return chunks;
        }

        String[] words = text.split("\\s+");
        int totalWords = words.length;
        int start = 0;

        while (start < totalWords) {
            int end = Math.min(start + CHUNK_SIZE, totalWords);
            StringBuilder chunk = new StringBuilder();
            for (int i = start; i < end; i++) {
                if (i > start) {
                    chunk.append(" ");
                }
                chunk.append(words[i]);
            }
            chunks.add(chunk.toString());
            start = end - CHUNK_OVERLAP;
            if (start >= totalWords - CHUNK_OVERLAP) {
                break;
            }
        }

        return chunks;
    }

    private int estimateTokenCount(String text) {
        if (text == null) return 0;
        return text.split("\\s+").length;
    }

    // ------------------------------------------------------------------
    // Embedding and storage
    // ------------------------------------------------------------------

    private void embedAndStoreChunks(Long documentId, Document document) {
        List<DocumentChunk> chunks = documentChunkRepository.findByDocumentId(documentId);
        if (chunks.isEmpty()) {
            log.warn("No chunks found for document {}", documentId);
            return;
        }

        List<String> contents = chunks.stream().map(DocumentChunk::getContent).toList();
        List<List<Float>> embeddings = embeddingService.generateEmbeddings(contents);

        List<StoredDocument> storedDocuments = new ArrayList<>();
        for (int i = 0; i < chunks.size(); i++) {
            DocumentChunk chunk = chunks.get(i);
            List<Float> embedding = embeddings.get(i);
            
            StoredDocument stored = StoredDocument.builder()
                    .pointId(documentId + "_chunk_" + chunk.getChunkIndex())
                    .vector(embedding)
                    .documentId(documentId)
                    .chunkId(chunk.getChunkIndex())
                    .filename(document.getOriginalFilename())
                    .courseId(document.getCourse() != null ? document.getCourse().getId() : null)
                    .uploadedBy(document.getUploadedBy().getId())
                    .documentType(document.getDocumentType().name())
                    .build();
            storedDocuments.add(stored);

            chunk.setEmbeddingGenerated(true);
            documentChunkRepository.save(chunk);
        }

        vectorStoreService.storeEmbeddings(storedDocuments);
        log.info("Batch embedded and stored {} chunks for document {}", storedDocuments.size(), documentId);
    }

    // ------------------------------------------------------------------
    // Prompt building
    // ------------------------------------------------------------------

    private String getChunkText(Long documentId, int chunkIndex) {
        return documentChunkRepository.findByDocumentIdAndChunkIndex(documentId, chunkIndex)
                .map(DocumentChunk::getContent)
                .orElse("[Chunk content not available]");
    }

    private String buildContext(List<String> chunks) {
        if (chunks.isEmpty()) {
            return "No relevant information found.";
        }

        StringBuilder context = new StringBuilder();
        for (int i = 0; i < chunks.size(); i++) {
            context.append(String.format("[Source %d]\n%s\n\n", i + 1, chunks.get(i)));
        }
        return context.toString();
    }

    private String buildPrompt(String context, String question) {
        return "You are an AI learning assistant.\n\n" +
                "Answer ONLY using the supplied context.\n" +
                "If the answer is not found in the context, clearly say that the information is not available.\n\n" +
                "Context:\n" +
                context + "\n" +
                "Question:\n" +
                question + "\n\n" +
                "Answer:";
    }
}