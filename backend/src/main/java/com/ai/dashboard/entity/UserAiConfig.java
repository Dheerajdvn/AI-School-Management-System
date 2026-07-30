package com.ai.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_ai_configs", indexes = {
    @Index(name = "idx_user_ai_config_user", columnList = "user_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAiConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String provider;

    @Column(name = "api_key", length = 1000)
    @Convert(converter = com.ai.dashboard.util.AesEncryptionConverter.class)
    private String apiKey;

    @Column(name = "base_url", length = 500)
    private String baseUrl;

    @Column(length = 100)
    private String model;

    @Column(nullable = false)
    @Builder.Default
    private Double temperature = 0.2;

    @Column(name = "max_tokens", nullable = false)
    @Builder.Default
    private Integer maxTokens = 2048;

    @Column(name = "streaming_enabled", nullable = false)
    @Builder.Default
    private Boolean streamingEnabled = true;

    @Column(name = "ai_suggestions_enabled", nullable = false)
    @Builder.Default
    private Boolean aiSuggestionsEnabled = true;

    @Column(name = "connected", nullable = false)
    @Builder.Default
    private Boolean connected = false;

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
