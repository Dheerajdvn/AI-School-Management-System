package com.ai.dashboard.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;

/**
 * Enrollment entity representing student enrollments in courses.
 */
@Entity
@Table(name = "enrollments", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}),
       indexes = {
           @Index(name = "idx_enrollment_status", columnList = "status"),
           @Index(name = "idx_enrollment_student", columnList = "student_id"),
           @Index(name = "idx_enrollment_course", columnList = "course_id")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "enrollment_date", nullable = false)
    private LocalDate enrollmentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.ENROLLED;

    @Min(0)
    @Max(100)
    @Column(nullable = false)
    @Builder.Default
    private Integer progress = 0;

    /**
     * Enrollment status enumeration.
     */
    public enum Status {
        ENROLLED, COMPLETED, DROPPED
    }
}