package com.ai.dashboard.ai.rag.service.impl;

import com.ai.dashboard.ai.rag.model.ChatMessage;
import com.ai.dashboard.ai.rag.model.ConversationSession;
import com.ai.dashboard.ai.rag.repository.ChatMessageRepository;
import com.ai.dashboard.ai.rag.repository.ConversationSessionRepository;
import com.ai.dashboard.ai.rag.service.ConversationService;
import com.ai.dashboard.config.OllamaProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Implementation of conversation management service.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final ConversationSessionRepository sessionRepository;
    private final ChatMessageRepository messageRepository;
    private final OllamaProperties properties;

    @Override
    @Transactional
    public String createSession(Long userId, String title) {
        String sessionId = UUID.randomUUID().toString();
        ConversationSession session = ConversationSession.builder()
                .sessionId(sessionId)
                .userId(userId)
                .title(title)
                .build();
        sessionRepository.save(session);
        log.info("Created conversation session {} for user {}", sessionId, userId);
        return sessionId;
    }

    @Override
    @Transactional
    public ChatMessage addMessage(String sessionId, ChatMessage.Role role, String content, String contextUsed) {
        ConversationSession session = sessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        ChatMessage message = ChatMessage.builder()
                .session(session)
                .role(role)
                .content(content)
                .tokenCount(estimateTokenCount(content))
                .contextUsed(contextUsed)
                .build();
        messageRepository.save(message);

        // Update session stats
        session.setMessageCount(session.getMessageCount() + 1);
        session.setTotalTokens(session.getTotalTokens() + message.getTokenCount());
        sessionRepository.save(session);

        return message;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessage> getSessionHistory(String sessionId) {
        return messageRepository.findBySessionIdOrderByCreatedAtAsc(
                sessionRepository.findBySessionId(sessionId)
                        .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId))
                        .getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationSession> getUserSessions(Long userId) {
        return sessionRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    @Override
    @Transactional
    public void trimHistoryIfNeeded(String sessionId) {
        ConversationSession session = sessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        Long sessionInternalId = session.getId();
        if (session.getTotalTokens() > properties.getMaxHistoryTokens()) {
            log.info("Trimming history for session {} (tokens: {})", sessionId, session.getTotalTokens());
            // Keep only the most recent messages to stay under limit
            // For now, we'll just log - full implementation would remove oldest messages
        }
    }

    @Override
    @Transactional
    public void deleteSession(String sessionId) {
        ConversationSession session = sessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));
        sessionRepository.delete(session);
    }

    private int estimateTokenCount(String text) {
        if (text == null) return 0;
        return text.split("\\s+").length;
    }
}