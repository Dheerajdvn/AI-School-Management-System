package com.ai.dashboard.controller;

import com.ai.dashboard.dto.*;
import com.ai.dashboard.service.SchoolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping({"/admin/schools", "/schools"})
@RequiredArgsConstructor
@Tag(name = "Schools", description = "School management and administration APIs")
public class SchoolController {

    private final SchoolService schoolService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all schools with pagination, search, and filtering")
    public ApiResponse<PagedResponse<SchoolDto>> getAllSchools(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            Authentication authentication) {
        PagedResponse<SchoolDto> response = schoolService.getAllSchools(page, size, search, status, sortBy, direction);
        return ApiResponse.success(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get school by ID")
    public ApiResponse<SchoolDto> getSchoolById(@PathVariable Long id, Authentication authentication) {
        SchoolDto dto = schoolService.getSchoolById(id);
        return ApiResponse.success(dto);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Create a new school and school admin user")
    public ResponseEntity<ApiResponse<SchoolCreateResponse>> createSchool(
            @Valid @RequestBody SchoolCreateRequest request,
            Authentication authentication) {
        SchoolCreateResponse response = schoolService.createSchool(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("School created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Update an existing school")
    public ApiResponse<SchoolDto> updateSchool(
            @PathVariable Long id,
            @Valid @RequestBody SchoolUpdateRequest request,
            Authentication authentication) {
        SchoolDto dto = schoolService.updateSchool(id, request);
        return ApiResponse.success("School updated successfully", dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Soft delete a school")
    public ApiResponse<Void> deleteSchool(@PathVariable Long id, Authentication authentication) {
        schoolService.deleteSchool(id);
        return ApiResponse.success("School deleted successfully", null);
    }

    @PostMapping("/{id}/toggle-status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Toggle school active/inactive status")
    public ApiResponse<SchoolDto> toggleStatus(@PathVariable Long id, Authentication authentication) {
        SchoolDto dto = schoolService.toggleStatus(id);
        return ApiResponse.success("School status toggled successfully", dto);
    }
}
