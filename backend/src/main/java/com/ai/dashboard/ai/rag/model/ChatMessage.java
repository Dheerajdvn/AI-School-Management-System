package com.ai.dashboard.ai.rag.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Individual chat message within a conversation session.
 */
@Entity
@Table(name = "chat_messages", indexes = {
    @Index(name = "idx_msg_session", columnList = "session_id"),
    @Index(name = "idx_msg_created", columnList = "created_at"),
    @Index(name = "idx_msg_role", columnList = "role")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "session_id", nullable = false)
    private ConversationSession session;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(name = "token_count")
    private Integer tokenCount;

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "context_used", length = 2000)
    private String contextUsed;

    /**
     * Message role enumeration.
     */
    public enum Role {
        USER, ASSISTANT, SYSTEM
    }
}