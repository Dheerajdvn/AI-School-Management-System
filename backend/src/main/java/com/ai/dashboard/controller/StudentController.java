package com.ai.dashboard.controller;

import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.dto.StudentDto;
import com.ai.dashboard.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Student CRUD + search REST endpoints.
 *
 * <p>Access control:
 * <ul>
 *   <li>CREATE/UPDATE/DELETE: ROLE_TEACHER and ROLE_ADMIN</li>
 *   <li>READ (GET/list/search): ROLE_STUDENT and above</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Student CRUD, search, filter, pagination & sorting")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN')")
    @Operation(summary = "Create a new student (TEACHER/ADMIN only)")
    public ResponseEntity<ApiResponse<StudentDto>> create(@Valid @RequestBody StudentDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created", studentService.create(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN')")
    @Operation(summary = "Update an existing student (TEACHER/ADMIN only)")
    public ApiResponse<StudentDto> update(@PathVariable Long id, @Valid @RequestBody StudentDto dto) {
        return ApiResponse.success("Student updated", studentService.update(id, dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get a student by id (ADMIN/TEACHER/STUDENT)")
    public ApiResponse<StudentDto> getById(@PathVariable Long id) {
        return ApiResponse.success(studentService.getById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN')")
    @Operation(summary = "Delete a student (TEACHER/ADMIN only)")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ApiResponse.success("Student deleted", null);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "List all students with pagination and sorting (ADMIN/TEACHER/STUDENT)")
    public ApiResponse<PagedResponse<StudentDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return ApiResponse.success(studentService.getAll(page, size, sortBy, direction));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Dynamic filtered search (ADMIN/TEACHER/STUDENT)")
    public ApiResponse<PagedResponse<StudentDto>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String course,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minFee,
            @RequestParam(required = false) Double maxFee,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate joiningFrom,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate joiningTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return ApiResponse.success(studentService.search(
                name, course, subject, city, minFee, maxFee, joiningFrom, joiningTo,
                page, size, sortBy, direction));
    }

    @GetMapping("/keyword")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Simple keyword search (ADMIN/TEACHER/STUDENT)")
    public ApiResponse<PagedResponse<StudentDto>> keyword(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(studentService.keywordSearch(q, page, size));
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Total student count (ADMIN/TEACHER/STUDENT)")
    public ApiResponse<Long> count() {
        return ApiResponse.success(studentService.count());
    }
}
