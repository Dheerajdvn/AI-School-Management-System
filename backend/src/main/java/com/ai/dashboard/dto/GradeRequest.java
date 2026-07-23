package com.ai.dashboard.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for grading a submission.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeRequest {

    @NotNull(message = "Obtained marks is required")
    @Min(value = 0, message = "Obtained marks cannot be negative")
    private Integer obtainedMarks;

    @Size(max = 500, message = "Feedback must not exceed 500 characters")
    private String feedback;

    @Size(max = 500, message = "Private notes must not exceed 500 characters")
    private String privateNotes;
}