package com.ai.dashboard.security;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication APIs")
public class RefreshTokenController {

    private static final String BEARER_PREFIX = "Bearer ";

    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<TokenResponse> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String cookieRefreshToken,
            @RequestBody(required = false) RefreshTokenRequest request,
            jakarta.servlet.http.HttpServletResponse response) {
        String token = (cookieRefreshToken != null && !cookieRefreshToken.isBlank())
                ? cookieRefreshToken
                : (request != null ? request.refreshToken() : null);

        if (token == null) {
            return ResponseEntity.badRequest().build();
        }

        Long userId = refreshTokenService.validateRefreshToken(token);
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        UserDetails userDetails = userDetailsService.loadUserById(userId);
        refreshTokenService.revokeRefreshToken(token);
        String newAccessToken = jwtService.generateToken(userDetails, userId);
        String newRefreshToken = refreshTokenService.createRefreshToken(userId);

        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie.from("refreshToken", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("None")
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new TokenResponse(newAccessToken));
    }

    @PostMapping("/logout-all")
    @Operation(summary = "Logout from all devices")
    public ResponseEntity<Void> logoutAllDevices(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            jakarta.servlet.http.HttpServletResponse response) {
        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            String token = authHeader.substring(BEARER_PREFIX.length());
            Long userId = jwtService.extractUserId(token);
            if (userId != null) {
                refreshTokenService.revokeAllUserTokens(userId);
            }
        }

        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok().build();
    }

    public record RefreshTokenRequest(@NotBlank String refreshToken) {}
    public record TokenResponse(String token) {}
}
