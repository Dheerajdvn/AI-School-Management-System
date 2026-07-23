package com.ai.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Request/Response payload for a student.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {

    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must not exceed 120 characters")
    private String name;

    @NotBlank(message = "Course is required")
    @Size(max = 80, message = "Course must not exceed 80 characters")
    private String course;

    @NotBlank(message = "Subject is required")
    @Size(max = 80, message = "Subject must not exceed 80 characters")
    private String subject;

    @NotNull(message = "Fee is required")
    @Min(value = 0, message = "Fee must be a positive value")
    private Double fee;

    @Size(max = 120, message = "Address must not exceed 120 characters")
    private String address;

    @NotNull(message = "Joining date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate joiningDate;
}
