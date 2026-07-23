package com.ai.dashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Password encoding configuration.
 *
 * <p>Provides BCrypt password encoder for secure password hashing.</p>
 */
@Configuration
public class PasswordConfig {

    /**
     * BCrypt password encoder with strength 10.
     *
     * @return configured PasswordEncoder bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}