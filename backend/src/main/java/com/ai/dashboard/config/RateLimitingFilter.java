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
        
        // Skip rate limiting for health endpoints
        if (path.contains("/health") || path.contains("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Long requests = redisTemplate.opsForValue().increment(key, 1);
            if (requests != null && requests == 1) {
                redisTemplate.expire(key, WINDOW.toMillis(), TimeUnit.MILLISECONDS);
            }

            if (requests != null && requests > MAX_REQUESTS) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("{\"error\":\"Rate limit exceeded\"}");
                log.warn("Rate limit exceeded for IP: {}", clientIp);
                return;
            }
        } catch (Exception e) {
            log.error("Rate limiting error", e);
        }

        filterChain.doFilter(request, response);
    }

    String getClientIp(HttpServletRequest request) {
        return request.getRemoteAddr();
    }
}