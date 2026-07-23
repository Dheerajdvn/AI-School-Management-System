package com.ai.dashboard.service.impl;

import com.ai.dashboard.ai.StudentAssistant;
import com.ai.dashboard.dto.ChatMessage;
import com.ai.dashboard.exception.AiServiceException;
import com.ai.dashboard.service.ChatService;
import com.ai.dashboard.testutil.TestBuilders;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceImplTest {

    @Mock
    private StudentAssistant studentAssistant;

    @InjectMocks
    private ChatServiceImpl chatService;

    @Test
    void reply_nullMessage_returnsDefaultResponse() {
        ChatMessage response = chatService.reply(null);
        assertEquals("assistant", response.getRole());
        assertTrue(response.getContent().contains("Please ask me something"));
    }

    @Test
    void reply_blankMessage_returnsDefaultResponse() {
        ChatMessage response = chatService.reply("   ");
        assertEquals("assistant", response.getRole());
        assertTrue(response.getContent().contains("Please ask me something"));
    }

    @Test
    void reply_validMessage_returnsAiResponse() {
        when(studentAssistant.chat("Hello")).thenReturn("Hi there!");
        ChatMessage response = chatService.reply("Hello");
        assertEquals("assistant", response.getRole());
        assertEquals("Hi there!", response.getContent());
    }

    @Test
    void reply_assistantThrowsException_throwsAiServiceException() {
        when(studentAssistant.chat("Hello")).thenThrow(new RuntimeException("LLM error"));
        assertThrows(AiServiceException.class, () -> chatService.reply("Hello"));
    }
}
