package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.CreateUserRequest;
import com.ai.dashboard.dto.UpdateUserRequest;
import com.ai.dashboard.dto.UserDto;
import com.ai.dashboard.entity.Role;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.repository.RoleRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.repository.UserSpecifications;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.AssignmentRepository;
import com.ai.dashboard.repository.EnrollmentRepository;
import com.ai.dashboard.repository.SubmissionRepository;
import com.ai.dashboard.repository.UserAiConfigRepository;
import com.ai.dashboard.document.repository.DocumentRepository;
import com.ai.dashboard.exception.ConflictException;
import com.ai.dashboard.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final DocumentRepository documentRepository;
    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SubmissionRepository submissionRepository;
    private final UserAiConfigRepository userAiConfigRepository;

    private UserDto toDto(User u) {
        return UserDto.builder()
                .id(u.getId())
                .username(u.getUsername())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .profilePictureUrl(u.getProfilePictureUrl())
                .enabled(u.isEnabled())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .roles(u.getRoles() == null ? Set.of() : u.getRoles().stream().filter(java.util.Objects::nonNull).map(Role::getName).filter(java.util.Objects::nonNull).collect(Collectors.toSet()))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDto> listUsers(String q, String role, Pageable pageable) {
        Specification<User> spec = Specification.allOf(
                UserSpecifications.matchesQuery(q),
                UserSpecifications.hasRole(role));
        return userRepository.findAll(spec, pageable).map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUser(Long id) {
        return userRepository.findById(id).map(this::toDto).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }

    @Override
    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        User u = new User();
        u.setUsername(request.getUsername());
        u.setFirstName(request.getFirstName());
        u.setLastName(request.getLastName());
        u.setEmail(request.getEmail());
        u.setPhone(request.getPhone());
        u.setPassword(passwordEncoder.encode(request.getPassword()));
        u.setEnabled(true);
        Set<Role> roles = new HashSet<>();
        Set<String> targetRoles = (request.getRoles() != null && !request.getRoles().isEmpty()) ? request.getRoles() : Set.of("ROLE_SCHOOL_ADMIN");
        targetRoles.forEach(rn -> {
            Role role = roleRepository.findByName(rn)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(rn).build()));
            roles.add(role);
        });
        u.setRoles(roles);
        u = userRepository.save(u);
        return toDto(u);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UpdateUserRequest request) {
        User u = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        if (!u.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (!u.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        u.setUsername(request.getUsername());
        u.setFirstName(request.getFirstName());
        u.setLastName(request.getLastName());
        u.setProfilePictureUrl(request.getProfilePictureUrl());
        u.setEmail(request.getEmail());
        u.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            request.getRoles().forEach(rn -> {
                Role role = roleRepository.findByName(rn)
                        .orElseGet(() -> roleRepository.save(Role.builder().name(rn).build()));
                roles.add(role);
            });
            u.setRoles(roles);
        }
        if (request.getEnabled() != null) {
            u.setEnabled(request.getEnabled());
        }
        u = userRepository.save(u);
        return toDto(u);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));

        if (documentRepository != null) {
            long docCount = documentRepository.countByUploadedById(id);
            if (docCount > 0) {
                throw new ConflictException("Cannot delete user because they still own " + docCount + " documents.");
            }
        }
        if (courseRepository != null) {
            long courseCount = courseRepository.countByTeacherId(id);
            if (courseCount > 0) {
                throw new ConflictException("Cannot delete user because they teach " + courseCount + " courses.");
            }
        }
        if (assignmentRepository != null) {
            long assignmentCount = assignmentRepository.countByTeacherId(id);
            if (assignmentCount > 0) {
                throw new ConflictException("Cannot delete user because they still manage " + assignmentCount + " assignments.");
            }
        }
        if (enrollmentRepository != null) {
            long enrollmentCount = enrollmentRepository.countByStudentId(id);
            if (enrollmentCount > 0) {
                throw new ConflictException("Cannot delete user because they have " + enrollmentCount + " enrollments.");
            }
        }
        if (submissionRepository != null) {
            long submissionCount = submissionRepository.countByStudentId(id);
            if (submissionCount > 0) {
                throw new ConflictException("Cannot delete user because they have " + submissionCount + " submissions.");
            }
        }
        if (userAiConfigRepository != null && userAiConfigRepository.findByUserId(id).isPresent()) {
            throw new ConflictException("Cannot delete user because they have AI configurations.");
        }

        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public UserDto setEnabled(Long id, boolean enabled) {
        User u = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        u.setEnabled(enabled);
        u = userRepository.save(u);
        return toDto(u);
    }

    @Override
    @Transactional
    public void resetPassword(Long id, String newPassword) {
        User u = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        u.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(u);
    }
}
