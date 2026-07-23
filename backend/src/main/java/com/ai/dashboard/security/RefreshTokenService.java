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

    public String createRefreshToken(Long userId) {
        String refreshToken = UUID.randomUUID().toString();
        String key = REFRESH_TOKEN_PREFIX + refreshToken;
        redisTemplate.opsForValue().set(key, userId.toString(), REFRESH_TOKEN_EXPIRY, TimeUnit.DAYS);
        redisTemplate.opsForSet().add(USER_TOKENS_PREFIX + userId, refreshToken);
        return refreshToken;
    }

    public Long validateRefreshToken(String refreshToken) {
        String key = REFRESH_TOKEN_PREFIX + refreshToken;
        String userId = redisTemplate.opsForValue().get(key);
        return userId != null ? Long.valueOf(userId) : null;
    }

    public void revokeRefreshToken(String refreshToken) {
        String key = REFRESH_TOKEN_PREFIX + refreshToken;
        String userId = redisTemplate.opsForValue().get(key);
        if (userId != null) {
            redisTemplate.delete(key);
            redisTemplate.opsForSet().remove(USER_TOKENS_PREFIX + userId, refreshToken);
        }
    }

    public void revokeAllUserTokens(Long userId) {
        String userTokensKey = USER_TOKENS_PREFIX + userId;
        var tokens = redisTemplate.opsForSet().members(userTokensKey);
        if (tokens != null) {
            tokens.forEach(token -> redisTemplate.delete(REFRESH_TOKEN_PREFIX + token));
        }
        redisTemplate.delete(userTokensKey);
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