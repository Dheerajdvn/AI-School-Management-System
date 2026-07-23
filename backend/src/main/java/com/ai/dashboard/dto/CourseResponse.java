package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for course response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {

    private Long id;
    private String courseCode;
    private String title;
    private String description;
    private Long teacherId;
    private String teacherName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}