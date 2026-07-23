package com.ai.dashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Persistent representation of a student record.
 *
 * <p>Mapped to the {@code student} table. Uses field-based access with Lombok
 * generated getters/setters. The schema is managed by Hibernate's
 * {@code ddl-auto=update}, but also matches {@code schema.sql} for explicit setups.</p>
 */
@Entity
@Table(name = "student")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "course", nullable = false, length = 80)
    private String course;

    @Column(name = "subject", nullable = false, length = 80)
    private String subject;

    @Column(name = "fee", nullable = false)
    private Double fee;

    @Column(name = "address", length = 120)
    private String address;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
