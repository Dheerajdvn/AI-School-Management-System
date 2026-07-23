package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Upcoming assignment DTO for student dashboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpcomingAssignmentDto {
    private Long assignmentId;
    private String title;
    private String courseCode;
    private String courseTitle;
    private LocalDateTime dueDate;
    private Integer maxMarks;
    private String status;
}