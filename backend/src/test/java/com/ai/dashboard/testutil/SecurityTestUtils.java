package com.ai.dashboard.testutil;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.stream.Collectors;

public class SecurityTestUtils {

    public static Authentication createAuthentication(String username, String... authorities) {
        List<SimpleGrantedAuthority> auths = List.of(authorities)
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        return new UsernamePasswordAuthenticationToken(username, null, auths);
    }

    public static Authentication createAuthenticationWithDetails(String username, Object details, String... authorities) {
        List<SimpleGrantedAuthority> auths = List.of(authorities)
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, null, auths);
        token.setDetails(details);
        return token;
    }

    public static void setAuthentication(Authentication authentication) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
    }

    public static void clearAuthentication() {
        SecurityContextHolder.clearContext();
    }

    public static UserDetails createUserDetails(String username, String... authorities) {
        List<SimpleGrantedAuthority> auths = List.of(authorities)
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        return org.springframework.security.core.userdetails.User.builder()
                .username(username)
                .password("password")
                .authorities(auths)
                .build();
    }
}
