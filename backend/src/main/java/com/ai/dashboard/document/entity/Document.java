package com.ai.dashboard.document.entity;

import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

/**
 * Document entity for file storage.
 */
@Entity
@Table(name = "documents", indexes = {
    @Index(name = "idx_document_uploaded_by", columnList = "uploaded_by"),
    @Index(name = "idx_document_course", columnList = "course_id"),
    @Index(name = "idx_document_type", columnList = "document_type"),
    @Index(name = "idx_document_processing_status", columnList = "processing_status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String filename;

    @NotBlank
    @Size(max = 255)
    @Column(name = "original_filename", nullable = false, length = 255)
    private String originalFilename;

    @NotBlank
    @Size(max = 100)
    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(name = "upload_time", nullable = false)
    @CreatedDate
    private LocalDateTime uploadTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private DocumentType documentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @NotBlank
    @Column(name = "storage_path", nullable = false)
    private String storagePath;

    @Enumerated(EnumType.STRING)
    @Column(name = "processing_status", nullable = false)
    @Builder.Default
    private ProcessingStatus processingStatus = ProcessingStatus.PENDING;

    /**
     * Document type enumeration.
     */
    public enum DocumentType {
        LECTURE_NOTES,
        ASSIGNMENT,
        REFERENCE,
        SYLLABUS,
        OTHER
    }

    /**
     * Processing status enumeration.
     */
    public enum ProcessingStatus {
        PENDING, PROCESSING, COMPLETED, FAILED
    }
}