package com.ai.dashboard.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for JWT token generation and validation.
 */
@Slf4j
@Component
public class JwtService {

    private static final long CLOCK_SKEW_SECONDS = 30;

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    /**
     * Generate JWT token for user.
     */
    public String generateToken(UserDetails userDetails, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        Set<String> roles = userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.toSet());
        claims.put("roles", roles);
        claims.put("userId", userId);
        return buildToken(claims, userDetails);
    }

    private String buildToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Extract user ID from JWT token.
     *
     * @throws io.jsonwebtoken.JwtException if token is invalid
     */
    public Long extractUserId(String token) {
        return getClaims(token).get("userId", Long.class);
    }

    /**
     * Extract username from JWT token.
     *
     * @throws io.jsonwebtoken.JwtException if token is invalid
     */
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Validate JWT token.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username;
        try {
            username = extractUsername(token);
        } catch (io.jsonwebtoken.JwtException e) {
            log.debug("JWT token validation failed: {}", e.getMessage());
            return false;
        }
        if (!userDetails.getUsername().equals(username)) {
            log.debug("JWT username mismatch: expected={}, actual={}", userDetails.getUsername(), username);
            return false;
        }
        return !isTokenExpired(token);
    }

    /**
     * Check if token is expired.
     */
    private boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            boolean expired = expiration.before(new Date());
            if (expired) {
                log.debug("JWT token expired at {}", expiration);
            }
            return expired;
        } catch (ExpiredJwtException e) {
            log.debug("JWT token expired: {}", e.getMessage());
            return true;
        }
    }

    /**
     * Extract expiration date from token.
     *
     * @throws io.jsonwebtoken.JwtException if token is invalid
     */
    private Date extractExpiration(String token) {
        return getClaims(token).getExpiration();
    }

    /**
     * Get signing key from secret.
     */
    private SecretKey getSignInKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Parse JWT claims with specific exception handling.
     *
     * @throws io.jsonwebtoken.JwtException with specific subtype
     */
    private Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSignInKey())
                    .clockSkewSeconds(CLOCK_SKEW_SECONDS)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw e;
        } catch (MalformedJwtException e) {
            log.debug("Malformed JWT token: {}", e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            log.debug("Unsupported JWT token: {}", e.getMessage());
            throw e;
        } catch (io.jsonwebtoken.security.SignatureException e) {
            log.debug("JWT signature validation failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.debug("JWT parsing failed: {}", e.getMessage());
            throw new MalformedJwtException("Invalid JWT token", e);
        }
    }
}
