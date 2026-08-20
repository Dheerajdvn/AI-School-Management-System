package com.ai.dashboard.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redisTemplate;
    private static final int MAX_REQUESTS = 100;
    private static final Duration WINDOW = Duration.ofMinutes(1);

    public RateLimitingFilter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        String clientIp = getClientIp(request);
        String key = "rate_limit:" + clientIp;
        String path = request.getRequestURI();
        
        // Skip rate limiting for health and static asset endpoints
        if (path.contains("/health") || path.contains("/actuator") || path.startsWith("/api/uploads/")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Long requests = redisTemplate.opsForValue().increment(key, 1);
            if (requests != null && requests == 1) {
                redisTemplate.expire(key, WINDOW.toMillis(), TimeUnit.MILLISECONDS);
            } else if (requests != null && requests > 1) {
                Long ttl = redisTemplate.getExpire(key);
                if (ttl != null && ttl == -1) {
                    redisTemplate.expire(key, WINDOW.toMillis(), TimeUnit.MILLISECONDS);
                }
            }

            if (requests != null && requests > MAX_REQUESTS) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"success\":false,\"error\":\"Rate limit exceeded. Please try again in 1 minute.\"}");
                log.warn("Rate limit exceeded for IP: {} on path: {}", clientIp, path);
                return;
            }
        } catch (Exception e) {
            log.error("Rate limiting filter error", e);
        }

        filterChain.doFilter(request, response);
    }

    String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isBlank()) {
            return xfHeader.split(",")[0].trim();
        }
        String cfHeader = request.getHeader("CF-Connecting-IP");
        if (cfHeader != null && !cfHeader.isBlank()) {
            return cfHeader.trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}