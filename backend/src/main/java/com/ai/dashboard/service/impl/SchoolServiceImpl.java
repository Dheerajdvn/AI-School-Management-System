package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.*;
import com.ai.dashboard.entity.Role;
import com.ai.dashboard.entity.School;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.RoleRepository;
import com.ai.dashboard.repository.SchoolRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.service.SchoolService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchoolServiceImpl implements SchoolService {

    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<SchoolDto> getAllSchools(int page, int size, String search, String status, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction != null ? direction : "desc"), sortBy != null ? sortBy : "id");
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<School> spec = (root, query, cb) -> {
            var predicate = cb.equal(root.get("deleted"), false);
            if (search != null && !search.trim().isEmpty()) {
                String like = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
                var searchPred = cb.or(
                        cb.like(cb.lower(root.get("schoolName")), like),
                        cb.like(cb.lower(root.get("schoolCode")), like),
                        cb.like(cb.lower(root.get("email")), like),
                        cb.like(cb.lower(root.get("city")), like)
                );
                predicate = cb.and(predicate, searchPred);
            }
            if (status != null && !status.trim().isEmpty() && !"all".equalsIgnoreCase(status)) {
                predicate = cb.and(predicate, cb.equal(cb.upper(root.get("status")), status.toUpperCase(Locale.ROOT)));
            }
            return predicate;
        };

        Page<School> schoolPage = schoolRepository.findAll(spec, pageable);
        List<SchoolDto> content = schoolPage.getContent().stream()
                .map(SchoolDto::fromEntity)
                .collect(Collectors.toList());

        return PagedResponse.<SchoolDto>builder()
                .content(content)
                .page(schoolPage.getNumber())
                .size(schoolPage.getSize())
                .totalElements(schoolPage.getTotalElements())
                .totalPages(schoolPage.getTotalPages())
                .last(schoolPage.isLast())
                .first(schoolPage.isFirst())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public SchoolDto getSchoolById(Long id) {
        School school = schoolRepository.findById(id)
                .filter(s -> !s.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + id));
        return SchoolDto.fromEntity(school);
    }

    @Override
    @Transactional
    public SchoolCreateResponse createSchool(SchoolCreateRequest request) {
        if (schoolRepository.existsBySchoolCode(request.getSchoolCode())) {
            throw new BadRequestException("School with code " + request.getSchoolCode() + " already exists");
        }

        School school = School.builder()
                .schoolName(request.getSchoolName())
                .schoolCode(request.getSchoolCode())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .subscriptionPlan(request.getSubscriptionPlan() != null ? request.getSubscriptionPlan() : "BASIC")
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .aiEnabled(request.isAiEnabled())
                .logoUrl(request.getLogoUrl())
                .deleted(false)
                .build();

        School savedSchool = schoolRepository.save(school);
        log.info("Created school: {}", savedSchool.getSchoolName());

        // Create School Admin user
        String adminUsername = "admin_" + savedSchool.getSchoolCode().toLowerCase(Locale.ROOT);
        String tempPassword = "Temp@" + UUID.randomUUID().toString().substring(0, 6);

        Role schoolAdminRole = roleRepository.findByName("ROLE_SCHOOL_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_SCHOOL_ADMIN").build()));

        if (!userRepository.existsByUsername(adminUsername)) {
            User adminUser = User.builder()
                    .username(adminUsername)
                    .email(savedSchool.getEmail())
                    .password(passwordEncoder.encode(tempPassword))
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .roles(Set.of(schoolAdminRole))
                    .build();
            userRepository.save(adminUser);
            log.info("Created admin user {} for school {}", adminUsername, savedSchool.getSchoolName());
        }

        return SchoolCreateResponse.builder()
                .school(SchoolDto.fromEntity(savedSchool))
                .username(adminUsername)
                .temporaryPassword(tempPassword)
                .build();
    }

    @Override
    @Transactional
    public SchoolDto updateSchool(Long id, SchoolUpdateRequest request) {
        School school = schoolRepository.findById(id)
                .filter(s -> !s.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + id));

        if (request.getSchoolName() != null) school.setSchoolName(request.getSchoolName());
        if (request.getEmail() != null) school.setEmail(request.getEmail());
        if (request.getPhone() != null) school.setPhone(request.getPhone());
        if (request.getAddress() != null) school.setAddress(request.getAddress());
        if (request.getCity() != null) school.setCity(request.getCity());
        if (request.getState() != null) school.setState(request.getState());
        if (request.getCountry() != null) school.setCountry(request.getCountry());
        if (request.getPostalCode() != null) school.setPostalCode(request.getPostalCode());
        if (request.getSubscriptionPlan() != null) school.setSubscriptionPlan(request.getSubscriptionPlan());
        if (request.getStatus() != null) school.setStatus(request.getStatus());
        if (request.getAiEnabled() != null) school.setAiEnabled(request.getAiEnabled());
        if (request.getLogoUrl() != null) school.setLogoUrl(request.getLogoUrl());

        School updated = schoolRepository.save(school);
        log.info("Updated school: {}", updated.getId());
        return SchoolDto.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteSchool(Long id) {
        School school = schoolRepository.findById(id)
                .filter(s -> !s.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + id));
        school.setDeleted(true);
        school.setStatus("INACTIVE");
        schoolRepository.save(school);
        log.info("Soft deleted school: {}", id);
    }

    @Override
    @Transactional
    public SchoolDto toggleStatus(Long id) {
        School school = schoolRepository.findById(id)
                .filter(s -> !s.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + id));
        String newStatus = "ACTIVE".equalsIgnoreCase(school.getStatus()) ? "INACTIVE" : "ACTIVE";
        school.setStatus(newStatus);
        School saved = schoolRepository.save(school);
        log.info("Toggled status for school {} to {}", id, newStatus);
        return SchoolDto.fromEntity(saved);
    }
}
