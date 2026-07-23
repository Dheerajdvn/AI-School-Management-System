package com.ai.dashboard.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "schools", indexes = {
    @Index(name = "idx_school_code", columnList = "school_code"),
    @Index(name = "idx_school_status", columnList = "status"),
    @Index(name = "idx_school_name", columnList = "school_name")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class School {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 150)
    @Column(name = "school_name", nullable = false, length = 150)
    private String schoolName;

    @NotBlank
    @Size(max = 50)
    @Column(name = "school_code", nullable = false, unique = true, length = 50)
    private String schoolCode;

    @Email
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String email;

    @Size(max = 30)
    @Column(length = 30)
    private String phone;

    @Size(max = 255)
    @Column(length = 255)
    private String address;

    @Size(max = 100)
    @Column(length = 100)
    private String city;

    @Size(max = 100)
    @Column(length = 100)
    private String state;

    @Size(max = 100)
    @Column(length = 100)
    private String country;

    @Size(max = 20)
    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Size(max = 50)
    @Column(name = "subscription_plan", length = 50)
    @Builder.Default
    private String subscriptionPlan = "BASIC";

    @NotBlank
    @Size(max = 30)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "ai_enabled", nullable = false)
    @Builder.Default
    private boolean aiEnabled = true;

    @Size(max = 255)
    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Integer version = 0;

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
