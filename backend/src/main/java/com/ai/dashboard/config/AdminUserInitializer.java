package com.ai.dashboard.config;

import com.ai.dashboard.entity.Role;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.repository.RoleRepository;
import com.ai.dashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Initializes a default ADMIN user on application startup if it doesn't already exist.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class AdminUserInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Order(10)
    @Transactional
    public ApplicationRunner initializeAdminUser() {
        return args -> {
            log.info("Checking default ADMIN user initialization...");
            
            // 1. Ensure ROLE_ADMIN exists
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        Role role = Role.builder().name("ROLE_ADMIN").build();
                        return roleRepository.save(role);
                    });

            // 2. Check if user exists by username or email
            boolean usernameExists = userRepository.existsByUsername("dheerajdvn");
            boolean emailExists = userRepository.existsByEmail("dheeraj@gmail.com");

            if (!usernameExists && !emailExists) {
                User admin = User.builder()
                        .username("dheerajdvn")
                        .firstName("Dheeraj")
                        .lastName("Verma")
                        .email("dheeraj@gmail.com")
                        .password(passwordEncoder.encode("root@123"))
                        .enabled(true)
                        .accountNonExpired(true)
                        .accountNonLocked(true)
                        .credentialsNonExpired(true)
                        .roles(Set.of(adminRole))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

                userRepository.save(admin);
                log.info("Default ADMIN user 'dheerajdvn' successfully created.");
            } else {
                log.info("Default ADMIN user 'dheerajdvn' or email 'dheeraj@gmail.com' already exists. Skipping creation.");
            }
        };
    }
}
