package com.ai.dashboard;

import com.ai.dashboard.testutil.IntegrationTest;
import com.ai.dashboard.util.AesEncryptionConverter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationContext;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.web.SecurityFilterChain;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Boots the full Spring context against the H2 test profile.
 *
 * <p>Every other test in this module is a plain Mockito unit test, so nothing else would notice a
 * broken bean definition, a missing required property, or a circular dependency until deploy time.
 * This is the cheapest possible guard against that class of failure.</p>
 *
 * <p>Redis is mocked because no server is running in CI; the external AI services (Ollama, Qdrant) are
 * configured with 1s timeouts in {@code src/test/resources/application.yml} and are only contacted
 * lazily, so they do not need stubbing to start.</p>
 */
@IntegrationTest
class ApplicationContextSmokeTest {

    @MockBean
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private ApplicationContext context;

    @Test
    void contextLoads() {
        assertThat(context).isNotNull();
    }

    @Test
    void securityIsWiredIn() {
        assertThat(context.getBeansOfType(SecurityFilterChain.class))
                .as("the application must not start without a security filter chain")
                .isNotEmpty();
    }

    @Test
    void encryptionConverterStartsOnlyWithAConfiguredKey() {
        // Proves the fail-fast constructor is satisfied by configuration rather than by a built-in
        // default: the context above could not have started otherwise.
        //
        // This is not hypothetical. When AesEncryptionConverter still had a no-arg constructor
        // alongside the @Value one, Spring preferred the no-arg variant, the configured key was never
        // injected, and *every* context boot died with "No encryption key configured" no matter what
        // APP_ENCRYPTION_KEY was set to. Nothing else in the suite noticed, because nothing else boots
        // a context. Blank the key in src/test/resources/application.yml and this must fail.
        assertThat(context.getBean(AesEncryptionConverter.class)).isNotNull();
    }
}
