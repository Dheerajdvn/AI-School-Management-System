package com.ai.dashboard.service;

import com.ai.dashboard.dto.ChatMessage;

/**
 * Contract for the conversational assistant.
 */
public interface ChatService {

    /**
     * Send a user message and receive an assistant reply.
     */
    ChatMessage reply(String userMessage);
}
