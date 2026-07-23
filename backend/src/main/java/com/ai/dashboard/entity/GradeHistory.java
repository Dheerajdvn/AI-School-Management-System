package com.ai.dashboard.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * GradeHistory entity for tracking grade changes.
 */
@Entity
@Table(name = "grade_history")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @Column(name = "previous_marks")
    private Integer previousMarks;

    @Column(name = "new_marks")
    private Integer newMarks;

    @Size(max = 500)
    @Column(name = "previous_feedback", length = 500)
    private String previousFeedback;

    @Size(max = 500)
    @Column(name = "new_feedback", length = 500)
    private String newFeedback;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", nullable = false)
    private User updatedBy;

    @Column(name = "updated_at", nullable = false)
    @CreatedDate
    private LocalDateTime updatedAt;

    @Size(max = 500)
    @Column(name = "private_notes", length = 500)
    private String privateNotes;
}