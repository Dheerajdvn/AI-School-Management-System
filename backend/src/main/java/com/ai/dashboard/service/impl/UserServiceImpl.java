package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.CreateUserRequest;
import com.ai.dashboard.dto.UpdateUserRequest;
import com.ai.dashboard.dto.UserDto;
import com.ai.dashboard.entity.Role;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.repository.RoleRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.repository.UserSpecifications;
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

    private UserDto toDto(User u) {
        return UserDto.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .enabled(u.isEnabled())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .roles(u.getRoles() == null ? Set.of() : u.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
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
        u.setEmail(request.getEmail());
        u.setPassword(passwordEncoder.encode(request.getPassword()));
        u.setEnabled(true);
        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null) {
            request.getRoles().forEach(rn -> roleRepository.findByName(rn).ifPresent(roles::add));
        }
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
        u.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRoles() != null) {
            Set<Role> roles = new HashSet<>();
            request.getRoles().forEach(rn -> roleRepository.findByName(rn).ifPresent(roles::add));
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
