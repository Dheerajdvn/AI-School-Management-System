package com.ai.dashboard.security;

import com.ai.dashboard.util.AesEncryptionConverter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AesEncryptionConverterTest {

    @Test
    @DisplayName("Encrypt and decrypt roundtrip succeeds with valid secret key")
    void testEncryptAndDecryptRoundtrip() {
        AesEncryptionConverter converter = new AesEncryptionConverter("MySuperSecretKey1234567890123456");

        String originalText = "sk-proj-ai-api-key-12345";
        String encrypted = converter.convertToDatabaseColumn(originalText);
        assertThat(encrypted).isNotNull().isNotEqualTo(originalText);
        assertThat(encrypted).startsWith("gcm:v1:");

        String decrypted = converter.convertToEntityAttribute(encrypted);
        assertThat(decrypted).isEqualTo(originalText);
    }

    @Test
    @DisplayName("Default no-arg constructor encrypts and decrypts properly")
    void testDefaultConstructor() {
        AesEncryptionConverter converter = new AesEncryptionConverter();

        String originalText = "sk-proj-test-default-key";
        String encrypted = converter.convertToDatabaseColumn(originalText);
        assertThat(encrypted).isNotNull().startsWith("gcm:v1:");

        String decrypted = converter.convertToEntityAttribute(encrypted);
        assertThat(decrypted).isEqualTo(originalText);
    }

    @Test
    @DisplayName("Null and blank attributes return original value without error")
    void testNullOrBlankHandling() {
        AesEncryptionConverter converter = new AesEncryptionConverter("MySuperSecretKey1234567890123456");

        assertThat(converter.convertToDatabaseColumn(null)).isNull();
        assertThat(converter.convertToDatabaseColumn("")).isEmpty();
        assertThat(converter.convertToEntityAttribute(null)).isNull();
        assertThat(converter.convertToEntityAttribute("")).isEmpty();
    }
}
