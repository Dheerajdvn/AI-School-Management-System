package com.ai.dashboard.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT authentication filter that processes Bearer tokens from Authorization header.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String AUTHORIZATION_HEADER = "Authorization";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        
        if (authHeader == null || authHeader.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }
        
        if (!authHeader.startsWith(BEARER_PREFIX)) {
            log.debug("Ignoring non-Bearer Authorization header for request [{}]", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }
        
        final String jwt = authHeader.substring(BEARER_PREFIX.length());
        
        try {
            final String username = jwtService.extractUsername(jwt);
            final Long userId = jwtService.extractUserId(jwt);
            
            if (username == null || SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }
            
            final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        userId,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.info("Successfully authenticated user: {}", username);
            }
            
            filterChain.doFilter(request, response);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.warn("JWT token expired for request [{}]", request.getRequestURI());
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
        } catch (io.jsonwebtoken.JwtException e) {
            log.warn("Invalid JWT token for request [{}]: {}", request.getRequestURI(), e.getMessage());
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("Unexpected error during JWT authentication for request [{}]", request.getRequestURI(), e);
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
        }
    }
}