package com.ai.dashboard.controller;

import com.ai.dashboard.dto.*;
import com.ai.dashboard.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping({"/school-admins", "/admin/school-admins"})
@RequiredArgsConstructor
@Tag(name = "School Admins", description = "School administrator management APIs")
public class SchoolAdminController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all school administrators")
    public ApiResponse<PagedResponse<UserDto>> getAllSchoolAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserDto> userPage = userService.listUsers(q, "ROLE_SCHOOL_ADMIN", pageable);

        PagedResponse<UserDto> pagedResponse = PagedResponse.<UserDto>builder()
                .content(userPage.getContent())
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .first(userPage.isFirst())
                .build();

        return ApiResponse.success(pagedResponse);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get school admin by ID")
    public ApiResponse<UserDto> getSchoolAdminById(@PathVariable Long id) {
        return ApiResponse.success(userService.getUser(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Create school admin")
    public ResponseEntity<ApiResponse<UserDto>> createSchoolAdmin(@Valid @RequestBody CreateUserRequest request) {
        UserDto dto = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("School admin created successfully", dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Update school admin")
    public ApiResponse<UserDto> updateSchoolAdmin(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        UserDto dto = userService.updateUser(id, request);
        return ApiResponse.success("School admin updated successfully", dto);
    }
}
