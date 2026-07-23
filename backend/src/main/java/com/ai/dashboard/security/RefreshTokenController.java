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
            @RequestBody RefreshTokenRequest request) {
        String refreshToken = request.refreshToken();
        Long userId = refreshTokenService.validateRefreshToken(refreshToken);
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        UserDetails userDetails = userDetailsService.loadUserById(userId);
        String newAccessToken = jwtService.generateToken(userDetails, userId);
        return ResponseEntity.ok(new TokenResponse(newAccessToken));
    }

    @PostMapping("/logout-all")
    @Operation(summary = "Logout from all devices")
    public ResponseEntity<Void> logoutAllDevices(
            @RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            return ResponseEntity.badRequest().build();
        }
        String token = authHeader.substring(BEARER_PREFIX.length());
        Long userId = jwtService.extractUserId(token);
        refreshTokenService.revokeAllUserTokens(userId);
        return ResponseEntity.ok().build();
    }

    public record RefreshTokenRequest(@NotBlank String refreshToken) {}
    public record TokenResponse(String token) {}
}
