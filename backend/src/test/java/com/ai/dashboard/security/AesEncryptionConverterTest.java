package com.ai.dashboard.security;

import com.ai.dashboard.util.AesEncryptionConverter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AesEncryptionConverterTest {

    @AfterEach
    void tearDown() {
        System.clearProperty("spring.profiles.active");
    }

    @Test
    @DisplayName("Encrypt and decrypt roundtrip succeeds with valid secret key")
    void testEncryptAndDecryptRoundtrip() {
        AesEncryptionConverter converter = new AesEncryptionConverter();
        converter.setSecretKey("MySuperSecretKey1234567890123456");

        String originalText = "sk-proj-ai-api-key-12345";
        String encrypted = converter.convertToDatabaseColumn(originalText);
        assertThat(encrypted).isNotNull().isNotEqualTo(originalText);

        String decrypted = converter.convertToEntityAttribute(encrypted);
        assertThat(decrypted).isEqualTo(originalText);
    }

    @Test
    @DisplayName("Null and blank attributes return original value without error")
    void testNullOrBlankHandling() {
        AesEncryptionConverter converter = new AesEncryptionConverter();
        converter.setSecretKey("MySuperSecretKey1234567890123456");

        assertThat(converter.convertToDatabaseColumn(null)).isNull();
        assertThat(converter.convertToDatabaseColumn("")).isEmpty();
        assertThat(converter.convertToEntityAttribute(null)).isNull();
        assertThat(converter.convertToEntityAttribute("")).isEmpty();
    }

    @Test
    @DisplayName("Missing secret key throws IllegalStateException on conversion in prod profile")
    void testMissingKeyThrowsInProd() {
        System.setProperty("spring.profiles.active", "prod");
        AesEncryptionConverter converter = new AesEncryptionConverter();

        assertThatThrownBy(() -> converter.setSecretKey(null))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("must be provided in production");
    }
}
