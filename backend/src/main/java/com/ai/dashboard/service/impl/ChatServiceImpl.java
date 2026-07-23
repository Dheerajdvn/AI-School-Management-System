package com.ai.dashboard.service.impl;

import com.ai.dashboard.ai.StudentAssistant;
import com.ai.dashboard.dto.ChatMessage;
import com.ai.dashboard.exception.AiServiceException;
import com.ai.dashboard.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Default {@link ChatService} backed by the LangChain4j {@link StudentAssistant}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final StudentAssistant studentAssistant;

    @Override
    public ChatMessage reply(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return ChatMessage.builder()
                    .role("assistant")
                    .content("Please ask me something about the students.")
                    .build();
        }
        try {
            String answer = studentAssistant.chat(userMessage);
            return ChatMessage.builder()
                    .role("assistant")
                    .content(answer)
                    .build();
        } catch (Exception e) {
            log.error("Chat failed: {}", e.getMessage());
            throw new AiServiceException("Chat service unavailable: " + e.getMessage(), e);
        }
    }
}
