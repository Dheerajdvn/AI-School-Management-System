package com.ai.dashboard.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UpdateUserRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^\\S+$", message = "Username must not contain spaces")
    private String username;

    private String firstName;
    private String lastName;
    private String profilePictureUrl;

    @NotBlank
    @Email
    private String email;

    @Pattern(regexp = "^\\d*$", message = "Phone must contain only numbers")
    private String phone;

    // Password optional on update
    @Size(min = 6, max = 128)
    private String password;

    private Set<String> roles;
    private Boolean enabled;
}
