package com.ai.dashboard.repository;

import com.ai.dashboard.entity.UserAiConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAiConfigRepository extends JpaRepository<UserAiConfig, Long> {
    Optional<UserAiConfig> findByUserId(Long userId);
    Optional<UserAiConfig> findByUserUsername(String username);
}
