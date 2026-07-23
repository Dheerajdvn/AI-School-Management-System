package com.ai.dashboard.controller;

import com.ai.dashboard.dto.*;
import com.ai.dashboard.service.UserService;
import com.ai.dashboard.entity.Role;
import com.ai.dashboard.repository.RoleRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/users")
@Validated
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs to manage users")
public class UserController {

    private final UserService userService;
    private final RoleRepository roleRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "List users with pagination, search and role filter (ADMIN only)")
    public ApiResponse<Page<UserDto>> listUsers(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", defaultValue = "username") String sortBy,
            @RequestParam(value = "direction", defaultValue = "asc") String direction
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.success(userService.listUsers(q, role, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get user by id (ADMIN only)")
    public ApiResponse<UserDto> getUser(@PathVariable Long id) {
        return ApiResponse.success(userService.getUser(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create a new user (ADMIN only)")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto dto = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update a user (ADMIN only)")
    public ApiResponse<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        return ApiResponse.success("User updated", userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete a user (ADMIN only)")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    @PostMapping("/{id}/enable")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Enable or disable a user account (ADMIN only)")
    public ApiResponse<UserDto> setEnabled(@PathVariable Long id, @RequestParam("enabled") boolean enabled) {
        return ApiResponse.success("User " + (enabled ? "enabled" : "disabled"), userService.setEnabled(id, enabled));
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Reset a user's password (ADMIN only)")
    public Map<String, String> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("newPassword is required");
        }
        userService.resetPassword(id, newPassword);
        return Map.of("message", "Password reset successfully");
    }

    @PostMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Set roles for a user (ADMIN only)")
    public ApiResponse<UserDto> setRoles(@PathVariable Long id, @RequestBody Set<String> roleNames) {
        // Validate roles exist
        roleNames.forEach(rn -> roleRepository.findByName(rn).orElseThrow(() -> new IllegalArgumentException("Role not found: " + rn)));
        UpdateUserRequest req = new UpdateUserRequest();
        req.setUsername(userService.getUser(id).getUsername());
        req.setEmail(userService.getUser(id).getEmail());
        req.setRoles(roleNames);
        return ApiResponse.success("Roles updated", userService.updateUser(id, req));
    }
}
