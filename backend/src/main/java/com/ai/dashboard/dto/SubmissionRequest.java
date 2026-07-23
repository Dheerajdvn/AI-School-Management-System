package com.ai.dashboard.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for submission creation/update request.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionRequest {

    @Size(max = 2000, message = "Submission text must not exceed 2000 characters")
    private String submissionText;

    @Size(max = 500, message = "Attachment URL must not exceed 500 characters")
    private String attachmentUrl;
}