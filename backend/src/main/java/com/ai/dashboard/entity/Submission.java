package com.ai.dashboard.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Submission entity representing student assignment submissions.
 */
@Entity
@Table(name = "submissions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "assignment_id"}),
       indexes = {
           @Index(name = "idx_submission_student", columnList = "student_id"),
           @Index(name = "idx_submission_assignment", columnList = "assignment_id"),
           @Index(name = "idx_submission_status", columnList = "status"),
           @Index(name = "idx_submission_submitted_at", columnList = "submitted_at"),
           @Index(name = "idx_submission_student_status", columnList = "student_id, status"),
           @Index(name = "idx_submission_assignment_status", columnList = "assignment_id, status")
       })
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "submitted_at")
    @CreatedDate
    private LocalDateTime submittedAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.DRAFT;

    @Size(max = 2000)
    @Column(length = 2000)
    private String submissionText;

    @Size(max = 500)
    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl;

    @Column(name = "obtained_marks")
    private Integer obtainedMarks;

    @Size(max = 500)
    @Column(length = 500)
    private String feedback;

    @Size(max = 500)
    @Column(name = "private_notes", length = 500)
    private String privateNotes;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by")
    private User gradedBy;

    /**
     * Submission status enumeration.
     */
    public enum Status {
        DRAFT, SUBMITTED, LATE, GRADED
    }
}