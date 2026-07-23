package com.ai.dashboard.dto;

import com.ai.dashboard.entity.School;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchoolDto {
    private Long id;
    private String schoolName;
    private String schoolCode;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String subscriptionPlan;
    private String status;
    private boolean aiEnabled;
    private String logoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SchoolDto fromEntity(School school) {
        if (school == null) return null;
        return SchoolDto.builder()
                .id(school.getId())
                .schoolName(school.getSchoolName())
                .schoolCode(school.getSchoolCode())
                .email(school.getEmail())
                .phone(school.getPhone())
                .address(school.getAddress())
                .city(school.getCity())
                .state(school.getState())
                .country(school.getCountry())
                .postalCode(school.getPostalCode())
                .subscriptionPlan(school.getSubscriptionPlan())
                .status(school.getStatus())
                .aiEnabled(school.isAiEnabled())
                .logoUrl(school.getLogoUrl())
                .createdAt(school.getCreatedAt())
                .updatedAt(school.getUpdatedAt())
                .build();
    }
}
