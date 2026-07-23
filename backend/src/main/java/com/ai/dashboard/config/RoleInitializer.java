package com.ai.dashboard.config;

import com.ai.dashboard.entity.Role;
import com.ai.dashboard.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

    /**
     * Initializes default roles on application startup.
     *
     * <p>Creates all supported roles if they don't exist.</p>
     */
    @Slf4j
    @Configuration
    @RequiredArgsConstructor
    public class RoleInitializer {

    private final RoleRepository roleRepository;

    @Bean
    public ApplicationRunner initializeRoles() {
        return args -> {
            log.info("Initializing default roles...");
            List<String> defaultRoles = List.of(
                    "ROLE_SUPER_ADMIN",
                    "ROLE_ADMIN",
                    "ROLE_PRINCIPAL",
                    "ROLE_SCHOOL_ADMIN",
                    "ROLE_TEACHER",
                    "ROLE_STUDENT");

            for (String roleName : defaultRoles) {
                if (!roleRepository.existsByName(roleName)) {
                    roleRepository.save(Role.builder().name(roleName).build());
                    log.info("Created role: {}", roleName);
                }
            }
            log.info("Role initialization complete");
        };
    }
}