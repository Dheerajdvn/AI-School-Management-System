package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Recently created course DTO for admin dashboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentCourseDto {
    private Long id;
    private String courseCode;
    private String title;
    private String teacherName;
    private LocalDateTime createdAt;
    private Integer maxEnrollment;
}