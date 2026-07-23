package com.ai.dashboard.ai.rag.repository;

import com.ai.dashboard.ai.rag.model.ConversationSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for conversation sessions.
 */
@Repository
public interface ConversationSessionRepository extends JpaRepository<ConversationSession, Long> {

    Optional<ConversationSession> findBySessionId(String sessionId);

    List<ConversationSession> findByUserIdOrderByUpdatedAtDesc(Long userId);

    List<ConversationSession> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title);

    void deleteByUserId(Long userId);
}