package com.ai.dashboard.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 * Request logging filter for structured observability.
 */
@Slf4j
@Component
public class LoggingFilter implements Filter {

    private static final String REQUEST_ID = "requestId";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        log.info("LoggingFilter initialized");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        try {
            String requestId = UUID.randomUUID().toString();
            MDC.put(REQUEST_ID, requestId);

            long startTime = System.currentTimeMillis();
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;

            log.info("Request: method={}, uri={}, requestId={}",
                    httpRequest.getMethod(),
                    httpRequest.getRequestURI(),
                    requestId);

            chain.doFilter(request, response);

            long duration = System.currentTimeMillis() - startTime;
            log.info("Response: status={}, duration={}ms, requestId={}",
                    httpResponse.getStatus(),
                    duration,
                    requestId);

        } finally {
            MDC.remove(REQUEST_ID);
        }
    }

    @Override
    public void destroy() {
        log.info("LoggingFilter destroyed");
    }
}