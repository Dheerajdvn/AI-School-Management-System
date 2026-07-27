package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.entity.AuditLog;
import com.ai.dashboard.repository.AuditLogRepository;
import com.ai.dashboard.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public void log(String username, String action, String entityType, String description, String ipAddress) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .username(username != null ? username : "system")
                    .action(action != null ? action.toUpperCase() : "INFO")
                    .entityType(entityType)
                    .description(description)
                    .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                    .build();
            auditLogRepository.save(auditLog);
            log.info("Audit Log: [{}] {} - {} by {}", action, entityType, description, username);
        } catch (Exception e) {
            log.error("Failed to save audit log", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AuditLog> getAuditLogs(String username, String action, String entityType, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        Specification<AuditLog> spec = (root, query, cb) -> {
            var predicate = cb.conjunction();
            if (username != null && !username.trim().isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("username")), "%" + username.trim().toLowerCase() + "%"));
            }
            if (action != null && !action.trim().isEmpty()) {
                predicate = cb.and(predicate, cb.equal(cb.upper(root.get("action")), action.toUpperCase()));
            }
            if (entityType != null && !entityType.trim().isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("entityType")), "%" + entityType.trim().toLowerCase() + "%"));
            }
            if (startDate != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("timestamp"), startDate));
            }
            if (endDate != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("timestamp"), endDate));
            }
            return predicate;
        };

        Page<AuditLog> pageResult = auditLogRepository.findAll(spec, pageable);
        return PagedResponse.<AuditLog>builder()
                .content(pageResult.getContent())
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();
    }
}
