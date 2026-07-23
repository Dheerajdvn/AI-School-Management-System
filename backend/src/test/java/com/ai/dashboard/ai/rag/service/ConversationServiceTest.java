package com.ai.dashboard.ai.rag.service;

import com.ai.dashboard.ai.rag.model.ChatMessage;
import com.ai.dashboard.ai.rag.model.ConversationSession;
import com.ai.dashboard.ai.rag.repository.ChatMessageRepository;
import com.ai.dashboard.ai.rag.repository.ConversationSessionRepository;
import com.ai.dashboard.ai.rag.service.impl.ConversationServiceImpl;
import com.ai.dashboard.config.OllamaProperties;
import com.ai.dashboard.testutil.TestConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
class ConversationServiceTest {

    @Mock
    private ConversationSessionRepository sessionRepository;

    @Mock
    private ChatMessageRepository messageRepository;

    @Mock
    private OllamaProperties properties;

    @InjectMocks
    private ConversationServiceImpl conversationService;

    private ConversationSession testSession;

    @BeforeEach
    void setUp() {
        testSession = ConversationSession.builder()
                .id(1L)
                .sessionId(TestConstants.TEST_SESSION_ID)
                .userId(TestConstants.TEST_USER_ID)
                .title("Test Session")
                .messageCount(0)
                .totalTokens(0)
                .build();
    }

    @Nested
    class CreateSession {

        @Test
        void should_create_session_successfully() {
            when(sessionRepository.save(any(ConversationSession.class))).thenReturn(testSession);

            String sessionId = conversationService.createSession(TestConstants.TEST_USER_ID, "Test Session");

            assertThat(sessionId).isNotNull();
            verify(sessionRepository).save(any(ConversationSession.class));
        }

        @Test
        void should_create_session_without_title() {
            ConversationSession sessionWithoutTitle = ConversationSession.builder()
                    .id(1L)
                    .sessionId(TestConstants.TEST_SESSION_ID)
                    .userId(TestConstants.TEST_USER_ID)
                    .build();
            when(sessionRepository.save(any(ConversationSession.class))).thenReturn(sessionWithoutTitle);

            String sessionId = conversationService.createSession(TestConstants.TEST_USER_ID, null);

            assertThat(sessionId).isNotNull();
        }
    }

    @Nested
    class AddMessage {

        @Test
        void should_add_message_successfully() {
            ChatMessage message = ChatMessage.builder()
                    .id(1L)
                    .session(testSession)
                    .role(ChatMessage.Role.USER)
                    .content(TestConstants.TEST_MESSAGE_CONTENT)
                    .tokenCount(3)
                    .build();
            when(sessionRepository.findBySessionId(TestConstants.TEST_SESSION_ID)).thenReturn(Optional.of(testSession));
            when(messageRepository.save(any(ChatMessage.class))).thenReturn(message);
            when(sessionRepository.save(any(ConversationSession.class))).thenReturn(testSession);

            ChatMessage result = conversationService.addMessage(
                    TestConstants.TEST_SESSION_ID,
                    ChatMessage.Role.USER,
                    TestConstants.TEST_MESSAGE_CONTENT,
                    null
            );

            assertThat(result).isNotNull();
            assertThat(result.getContent()).isEqualTo(TestConstants.TEST_MESSAGE_CONTENT);
        }

        @Test
        void should_throw_exception_for_nonexistent_session() {
            when(sessionRepository.findBySessionId(TestConstants.TEST_SESSION_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> conversationService.addMessage(
                    TestConstants.TEST_SESSION_ID,
                    ChatMessage.Role.USER,
                    TestConstants.TEST_MESSAGE_CONTENT,
                    null
            )).isInstanceOf(IllegalArgumentException.class)
              .hasMessageContaining("Session not found");
        }
    }

    @Nested
    class GetSessionHistory {

        @Test
        void should_return_empty_history_for_no_messages() {
            when(sessionRepository.findBySessionId(TestConstants.TEST_SESSION_ID)).thenReturn(Optional.of(testSession));
            when(messageRepository.findBySessionIdOrderByCreatedAtAsc(1L)).thenReturn(new ArrayList<>());

            List<ChatMessage> history = conversationService.getSessionHistory(TestConstants.TEST_SESSION_ID);

            assertThat(history).isEmpty();
        }

        @Test
        void should_throw_exception_for_nonexistent_session() {
            when(sessionRepository.findBySessionId(TestConstants.TEST_SESSION_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> conversationService.getSessionHistory(TestConstants.TEST_SESSION_ID))
                    .isInstanceOf(IllegalArgumentException.class);
        }
    }

    @Nested
    class GetUserSessions {

        @Test
        void should_return_user_sessions_ordered_by_updated_at() {
            List<ConversationSession> sessions = new ArrayList<>();
            sessions.add(testSession);
            when(sessionRepository.findByUserIdOrderByUpdatedAtDesc(TestConstants.TEST_USER_ID)).thenReturn(sessions);

            List<ConversationSession> result = conversationService.getUserSessions(TestConstants.TEST_USER_ID);

            assertThat(result).hasSize(1);
        }
    }

    @Nested
    class DeleteSession {

        @Test
        void should_delete_session_successfully() {
            when(sessionRepository.findBySessionId(TestConstants.TEST_SESSION_ID)).thenReturn(Optional.of(testSession));

            conversationService.deleteSession(TestConstants.TEST_SESSION_ID);

            verify(sessionRepository).delete(testSession);
        }

        @Test
        void should_throw_exception_for_nonexistent_session() {
            when(sessionRepository.findBySessionId(TestConstants.TEST_SESSION_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> conversationService.deleteSession(TestConstants.TEST_SESSION_ID))
                    .isInstanceOf(IllegalArgumentException.class);
        }
    }
}