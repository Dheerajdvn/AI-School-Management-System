package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for grade statistics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeStatistics {

    private Long courseId;
    private Long assignmentId;
    private Integer totalSubmissions;
    private Integer gradedSubmissions;
    private Integer ungradedSubmissions;
    private Double averagePercentage;
    private Double minPercentage;
    private Double maxPercentage;
    private String mostCommonLetterGrade;
    private Integer gradeACount;
    private Integer gradeBCount;
    private Integer gradeCCount;
    private Integer gradeDCount;
    private Integer gradeFCount;
}