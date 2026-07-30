package com.ai.dashboard.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.assertj.core.api.Assertions.assertThat;

class RateLimitingFilterTest {

    @Test
    @DisplayName("getClientIp delegates to request.getRemoteAddr() managed by Spring ForwardedHeaderFilter")
    void testGetClientIpUsesRemoteAddr() {
        RateLimitingFilter filter = new RateLimitingFilter(null);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("198.51.100.42");

        String clientIp = filter.getClientIp(request);
        assertThat(clientIp).isEqualTo("198.51.100.42");
    }
}
