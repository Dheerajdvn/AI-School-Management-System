package com.ai.dashboard.ai.rag.service;

import com.ai.dashboard.ai.rag.dto.RagChatResponse;
import com.ai.dashboard.ai.rag.model.ChatMessage;

import java.util.List;

/**
 * Service for managing conversation sessions and chat history.
 */
public interface ConversationService {

    /**
     * Create a new conversation session.
     *
     * @param userId the user ID
     * @param title the session title (optional)
     * @return the session ID
     */
    String createSession(Long userId, String title);

    /**
     * Add a message to a conversation session.
     *
     * @param sessionId the session ID
     * @param role the message role (USER or ASSISTANT)
     * @param content the message content
     * @param contextUsed the context used for generating the response (for assistant messages)
     * @return the saved message
     */
    ChatMessage addMessage(String sessionId, ChatMessage.Role role, String content, String contextUsed);

    /**
     * Get chat history for a session.
     *
     * @param sessionId the session ID
     * @return list of messages ordered by creation time
     */
    List<ChatMessage> getSessionHistory(String sessionId);

    /**
     * Get all sessions for a user.
     *
     * @param userId the user ID
     * @return list of sessions ordered by last update time
     */
    List<com.ai.dashboard.ai.rag.model.ConversationSession> getUserSessions(Long userId);

    /**
     * Trim old messages if context exceeds token limit.
     *
     * @param sessionId the session ID
     */
    void trimHistoryIfNeeded(String sessionId);

    /**
     * Delete a conversation session.
     *
     * @param sessionId the session ID
     */
    void deleteSession(String sessionId);
}