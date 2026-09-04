package com.ai.dashboard.controller;

import com.ai.dashboard.dto.*;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.service.UserService;
import com.ai.dashboard.entity.Role;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.repository.RoleRepository;
import com.ai.dashboard.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/users")
@Validated
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs to manage users")
public class UserController {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "List users with pagination, search and role filter (ADMIN only)")
    public ApiResponse<Page<UserDto>> listUsers(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", defaultValue = "username") String sortBy,
            @RequestParam(value = "direction", defaultValue = "asc") String direction
    ) {
        Set<String> allowedSortFields = Set.of("id", "username", "email", "createdAt", "updatedAt", "enabled");
        String validSortBy = allowedSortFields.contains(sortBy) ? sortBy : "id";
        Sort.Direction sortDir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(sortDir, validSortBy));
        return ApiResponse.success(userService.listUsers(q, role, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user by id")
    public ApiResponse<UserDto> getUser(@PathVariable Long id, Authentication authentication) {
        validateUserAccess(id, authentication);
        return ApiResponse.success(userService.getUser(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Create a new user (ADMIN only)")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto dto = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a user")
    public ApiResponse<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication) {
        validateUserAccess(id, authentication);
        // Privilege fields are admin-only. A non-admin may update their own profile, so silently
        // discard any roles/enabled values they submit rather than rejecting the whole request.
        // Admins keep full pass-through; role changes should otherwise go via POST /{id}/roles.
        if (!isAdmin(authentication)) {
            if (request.getRoles() != null || request.getEnabled() != null) {
                log.warn("Non-admin user attempted to modify privilege fields on user {}; roles/enabled ignored", id);
            }
            request.setRoles(null);
            request.setEnabled(null);
        }
        return ApiResponse.success("User updated", userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Delete a user (ADMIN only)")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    @PostMapping("/{id}/enable")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Enable or disable a user account (ADMIN only)")
    public ApiResponse<UserDto> setEnabled(@PathVariable Long id, @RequestParam("enabled") boolean enabled) {
        return ApiResponse.success("User " + (enabled ? "enabled" : "disabled"), userService.setEnabled(id, enabled));
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
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
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Set roles for a user (ADMIN only)")
    public ApiResponse<UserDto> setRoles(@PathVariable Long id, @RequestBody Set<String> roleNames) {
        // Validate roles exist
        roleNames.forEach(rn -> roleRepository.findByName(rn).orElseThrow(() -> new IllegalArgumentException("Role not found: " + rn)));
        UserDto existing = userService.getUser(id);
        UpdateUserRequest req = new UpdateUserRequest();
        req.setUsername(existing.getUsername());
        req.setFirstName(existing.getFirstName());
        req.setLastName(existing.getLastName());
        req.setEmail(existing.getEmail());
        req.setRoles(roleNames);
        return ApiResponse.success("Roles updated", userService.updateUser(id, req));
    }

    @PostMapping(value = "/{id}/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload profile picture")
    public ApiResponse<UserDto> uploadProfilePicture(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        validateUserAccess(id, authentication);

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File must not be empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum limit of 5MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file type. Allowed types: JPEG, PNG, WebP, GIF");
        }

        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        try {
            Path storagePath = Paths.get("uploads/profiles").toAbsolutePath().normalize();
            Files.createDirectories(storagePath);

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "avatar.png";
            String sanitizedName = originalName.replaceAll("[^a-zA-Z0-9.-]", "_");
            String filename = UUID.randomUUID() + "_" + sanitizedName;
            Path targetPath = storagePath.resolve(filename).normalize();

            if (!targetPath.startsWith(storagePath)) {
                throw new BadRequestException("Invalid file path");
            }

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            
            String fileUrl = "/api/uploads/profiles/" + filename;
            UpdateUserRequest req = new UpdateUserRequest();
            req.setUsername(user.getUsername());
            req.setFirstName(user.getFirstName());
            req.setLastName(user.getLastName());
            req.setEmail(user.getEmail());
            req.setProfilePictureUrl(fileUrl);
            UserDto updated = userService.updateUser(id, req);
            return ApiResponse.success("Profile picture uploaded", updated);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to upload profile picture", e);
            throw new RuntimeException("Failed to upload profile picture: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/picture")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Remove profile picture")
    public ApiResponse<UserDto> removeProfilePicture(@PathVariable Long id, Authentication authentication) {
        validateUserAccess(id, authentication);
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        UpdateUserRequest req = new UpdateUserRequest();
        req.setUsername(user.getUsername());
        req.setFirstName(user.getFirstName());
        req.setLastName(user.getLastName());
        req.setEmail(user.getEmail());
        req.setPhone(user.getPhone());
        req.setProfilePictureUrl(null);
        UserDto updated = userService.updateUser(id, req);
        return ApiResponse.success("Profile picture removed", updated);
    }

    private boolean isAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()) || "ROLE_SUPER_ADMIN".equals(a.getAuthority()));
    }

    private void validateUserAccess(Long targetUserId, Authentication authentication) {
        if (authentication == null) {
            throw new AccessDeniedException("User not authenticated");
        }
        if (isAdmin(authentication)) {
            return;
        }
        Long currentUserId = extractUserId(authentication);
        if (currentUserId == null || !currentUserId.equals(targetUserId)) {
            throw new AccessDeniedException("You do not have permission to access or modify this user profile");
        }
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication == null) return null;
        Object credentials = authentication.getCredentials();
        if (credentials instanceof Long) {
            return (Long) credentials;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return ((User) principal).getId();
        }
        return null;
    }
}

