package com.ai.dashboard.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchoolUpdateRequest {

    @Size(max = 150)
    private String schoolName;

    @Email(message = "Invalid email format")
    @Size(max = 100)
    private String email;

    @Size(max = 30)
    private String phone;

    @Size(max = 255)
    private String address;

    @Size(max = 100)
    private String city;

    @Size(max = 100)
    private String state;

    @Size(max = 100)
    private String country;

    @Size(max = 20)
    private String postalCode;

    @Size(max = 50)
    private String subscriptionPlan;

    private String status;

    private Boolean aiEnabled;

    @Size(max = 255)
    private String logoUrl;
}
