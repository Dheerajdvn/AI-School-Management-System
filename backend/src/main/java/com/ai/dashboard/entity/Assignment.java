package com.ai.dashboard.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Assignment entity representing course assignments.
 */
@Entity
@Table(name = "assignments", indexes = {
    @Index(name = "idx_assignment_course", columnList = "course_id"),
    @Index(name = "idx_assignment_teacher", columnList = "teacher_id"),
    @Index(name = "idx_assignment_status", columnList = "status"),
    @Index(name = "idx_assignment_due_date", columnList = "due_date")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String title;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @Size(max = 1000)
    @Column(length = 1000)
    private String instructions;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Min(1)
    @Column(name = "max_marks", nullable = false)
    private Integer maxMarks;

    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.DRAFT;

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    /**
     * Assignment status enumeration.
     */
    public enum Status {
        DRAFT, PUBLISHED, CLOSED
    }
}