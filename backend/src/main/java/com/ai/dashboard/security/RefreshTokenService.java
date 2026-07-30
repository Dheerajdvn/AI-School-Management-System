package com.ai.dashboard.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final StringRedisTemplate redisTemplate;
    private final JwtService jwtService;
    
    private static final String REFRESH_TOKEN_PREFIX = "refresh_token:";
    private static final String USER_TOKENS_PREFIX = "user_tokens:";
    private static final long REFRESH_TOKEN_EXPIRY = 7; // 7 days

    private final java.util.Map<String, Long> memoryStore = new java.util.concurrent.ConcurrentHashMap<>();

    public String createRefreshToken(Long userId) {
        String refreshToken = UUID.randomUUID().toString();
        try {
            if (redisTemplate != null && redisTemplate.getConnectionFactory() != null) {
                String key = REFRESH_TOKEN_PREFIX + refreshToken;
                redisTemplate.opsForValue().set(key, userId.toString(), REFRESH_TOKEN_EXPIRY, TimeUnit.DAYS);
                redisTemplate.opsForSet().add(USER_TOKENS_PREFIX + userId, refreshToken);
            }
        } catch (Exception e) {
            // Fallback to memory store if Redis is unavailable
        }
        memoryStore.put(refreshToken, userId);
        return refreshToken;
    }

    public Long validateRefreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return null;
        }
        try {
            if (redisTemplate != null && redisTemplate.getConnectionFactory() != null) {
                String key = REFRESH_TOKEN_PREFIX + refreshToken;
                String userId = redisTemplate.opsForValue().get(key);
                if (userId != null) {
                    return Long.valueOf(userId);
                }
            }
        } catch (Exception e) {
            // ignore
        }
        return memoryStore.get(refreshToken);
    }

    public void revokeRefreshToken(String refreshToken) {
        if (refreshToken == null) return;
        memoryStore.remove(refreshToken);
        try {
            if (redisTemplate != null && redisTemplate.getConnectionFactory() != null) {
                String key = REFRESH_TOKEN_PREFIX + refreshToken;
                String userId = redisTemplate.opsForValue().get(key);
                if (userId != null) {
                    redisTemplate.delete(key);
                    redisTemplate.opsForSet().remove(USER_TOKENS_PREFIX + userId, refreshToken);
                }
            }
        } catch (Exception e) {
            // ignore
        }
    }

    public void revokeAllUserTokens(Long userId) {
        if (userId == null) return;
        memoryStore.values().removeIf(id -> id.equals(userId));
        try {
            if (redisTemplate != null && redisTemplate.getConnectionFactory() != null) {
                String userTokensKey = USER_TOKENS_PREFIX + userId;
                var tokens = redisTemplate.opsForSet().members(userTokensKey);
                if (tokens != null) {
                    tokens.forEach(token -> redisTemplate.delete(REFRESH_TOKEN_PREFIX + token));
                }
                redisTemplate.delete(userTokensKey);
            }
        } catch (Exception e) {
            // ignore
        }
    }

    public String generateAccessTokenFromRefreshToken(String refreshToken) {
        Long userId = validateRefreshToken(refreshToken);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }
        // The caller should use loadUserById(userId) and jwtService.generateToken()
        return String.valueOf(userId);
    }
}