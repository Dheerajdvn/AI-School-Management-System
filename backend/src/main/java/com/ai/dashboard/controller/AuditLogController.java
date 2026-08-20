package com.ai.dashboard.controller;

import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.entity.AuditLog;
import com.ai.dashboard.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping({"/audit-logs", "/admin/audit-logs"})
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "Audit logs APIs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Get all audit logs with filters and pagination")
    public ApiResponse<PagedResponse<AuditLog>> getAllAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction != null ? direction : "desc"), sortBy != null ? sortBy : "timestamp");
        PagedResponse<AuditLog> response = auditLogService.getAuditLogs(username, action, entityType, startDate, endDate, PageRequest.of(page, size, sort));
        return ApiResponse.success(response);
    }
}
