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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;

/**
 * Verifies and repairs the admin user's password on startup if it is not BCrypt encoded,
 * and ensures ROLE_ADMIN is assigned.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class AdminPasswordInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Transactional
    public ApplicationRunner verifyAndRepairAdminPassword() {
        return args -> {
            Optional<User> adminOpt = userRepository.findByUsername("admin");
            if (adminOpt.isEmpty()) {
                log.info("Admin user not found — skipping password verification.");
                return;
            }

            User admin = adminOpt.get();
            String currentPassword = admin.getPassword();
            boolean isBcrypt = currentPassword != null &&
                    (currentPassword.startsWith("$2a$") || currentPassword.startsWith("$2b$") || currentPassword.startsWith("$2y$"));

            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));

            if (admin.getRoles() == null) {
                admin.setRoles(new HashSet<>());
            }
            boolean hasRoleAdmin = admin.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));

            if (isBcrypt && hasRoleAdmin) {
                log.info("Admin password verified.");
            } else {
                String envAdminPassword = System.getenv("ADMIN_INIT_PASSWORD");
                if (envAdminPassword != null && !envAdminPassword.isBlank()) {
                    admin.setPassword(passwordEncoder.encode(envAdminPassword));
                    if (!hasRoleAdmin) {
                        admin.getRoles().add(adminRole);
                    }
                    userRepository.save(admin);
                    log.info("Admin password updated using environment variable configuration.");
                } else {
                    log.warn("Admin password is non-standard or missing ROLE_ADMIN, but ADMIN_INIT_PASSWORD env var is not set. Skipping automatic password overwrite.");
                }
            }
        };
    }
}
