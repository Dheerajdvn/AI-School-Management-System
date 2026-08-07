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
            
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        Role role = Role.builder().name("ROLE_ADMIN").build();
                        return roleRepository.save(role);
                    });

            String adminUsername = System.getenv("ADMIN_INIT_USERNAME");
            String adminPassword = System.getenv("ADMIN_INIT_PASSWORD");
            String adminEmail = System.getenv("ADMIN_INIT_EMAIL");

            if (adminUsername == null || adminUsername.isBlank()) {
                adminUsername = "dheerajdvn";
            }
            if (adminEmail == null || adminEmail.isBlank()) {
                adminEmail = "dheerajdvn@gmail.com";
            }

            // Only auto-create if an explicit password is set in env or running in dev environment
            if (adminPassword == null || adminPassword.isBlank()) {
                log.info("No ADMIN_INIT_PASSWORD environment variable supplied. Skipping automatic admin user creation.");
                return;
            }

            boolean usernameExists = userRepository.existsByUsername(adminUsername);
            boolean emailExists = userRepository.existsByEmail(adminEmail);

            if (!usernameExists && !emailExists) {
                User admin = User.builder()
                        .username(adminUsername)
                        .firstName("Admin")
                        .lastName("User")
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .enabled(true)
                        .accountNonExpired(true)
                        .accountNonLocked(true)
                        .credentialsNonExpired(true)
                        .roles(Set.of(adminRole))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

                userRepository.save(admin);
                log.info("Default ADMIN user '{}' successfully created.", adminUsername);
            } else {
                log.info("Default ADMIN user or email already exists. Skipping creation.");
            }
        };
    }
}
