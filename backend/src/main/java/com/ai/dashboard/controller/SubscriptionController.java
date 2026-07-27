package com.ai.dashboard.controller;

import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.entity.School;
import com.ai.dashboard.repository.SchoolRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping({"/subscriptions", "/admin/subscriptions"})
@RequiredArgsConstructor
@Tag(name = "Subscriptions", description = "Subscription management APIs")
public class SubscriptionController {

    private final SchoolRepository schoolRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all subscriptions")
    public ApiResponse<PagedResponse<Object>> getAllSubscriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<School> schoolPage = schoolRepository.findAll(
                (root, query, cb) -> cb.equal(root.get("deleted"), false),
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
        );

        List<Object> content = schoolPage.getContent().stream().map(school -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", school.getId());
            map.put("schoolName", school.getSchoolName());
            map.put("plan", school.getSubscriptionPlan() != null ? school.getSubscriptionPlan() : "BASIC");
            map.put("startDate", school.getCreatedAt() != null ? school.getCreatedAt().toString() : null);
            map.put("endDate", school.getCreatedAt() != null ? school.getCreatedAt().plusYears(1).toString() : null);
            map.put("status", school.getStatus() != null ? school.getStatus() : "ACTIVE");
            map.put("amount", "ENTERPRISE".equals(school.getSubscriptionPlan()) ? 299 : ("PREMIUM".equals(school.getSubscriptionPlan()) ? 199 : 99));
            return (Object) map;
        }).collect(Collectors.toList());

        PagedResponse<Object> response = PagedResponse.builder()
                .content(content)
                .page(schoolPage.getNumber())
                .size(schoolPage.getSize())
                .totalElements(schoolPage.getTotalElements())
                .totalPages(schoolPage.getTotalPages())
                .last(schoolPage.isLast())
                .first(schoolPage.isFirst())
                .build();
        return ApiResponse.success(response);
    }
}
