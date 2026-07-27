package com.ai.dashboard.service;

import com.ai.dashboard.entity.AuditLog;
import com.ai.dashboard.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface AuditLogService {
    void log(String username, String action, String entityType, String description, String ipAddress);

    PagedResponse<AuditLog> getAuditLogs(String username, String action, String entityType, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}
