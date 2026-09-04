package com.ai.dashboard.security;

import com.ai.dashboard.util.AesEncryptionConverter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledIfEnvironmentVariable;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AesEncryptionConverterTest {

    private static final String VALID_KEY = "MySuperSecretKey1234567890123456";

    @Test
    @DisplayName("Encrypt and decrypt roundtrip succeeds with valid secret key")
    void testEncryptAndDecryptRoundtrip() {
        AesEncryptionConverter converter = new AesEncryptionConverter(VALID_KEY);

        String originalText = "sk-proj-ai-api-key-12345";
        String encrypted = converter.convertToDatabaseColumn(originalText);
        assertThat(encrypted).isNotNull().isNotEqualTo(originalText);
        assertThat(encrypted).startsWith("gcm:v1:");

        String decrypted = converter.convertToEntityAttribute(encrypted);
        assertThat(decrypted).isEqualTo(originalText);
    }

    @Test
    @DisplayName("Constructor refuses to fall back to a built-in default key")
    @DisabledIfEnvironmentVariable(named = "APP_ENCRYPTION_KEY", matches = ".+",
            disabledReason = "A real key is present in the environment, so no-key behaviour cannot be observed")
    void testMissingKeyIsRejected() {
        assertThatThrownBy(() -> new AesEncryptionConverter(null))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("No encryption key configured");

        assertThatThrownBy(() -> new AesEncryptionConverter("   "))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("No encryption key configured");
    }

    @Test
    @DisplayName("Keys shorter than 32 characters are rejected rather than silently accepted")
    void testShortKeyIsRejected() {
        // The previously published key was exactly 16 characters and was silently accepted.
        assertThatThrownBy(() -> new AesEncryptionConverter("1234567890123456"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("too short");
    }

    @Test
    @DisplayName("Full key is used without truncation, so two keys sharing a 16-char prefix differ")
    void testKeyIsNotTruncatedToSixteenBytes() {
        AesEncryptionConverter first = new AesEncryptionConverter("SameFirst16Chars" + "-suffix-alpha-padding");
        AesEncryptionConverter second = new AesEncryptionConverter("SameFirst16Chars" + "-suffix-beta-padding!");

        String encrypted = first.convertToDatabaseColumn("secret-value");

        // Under the old substring(0,16) derivation both keys collapsed to the same AES key and this
        // would have decrypted successfully.
        assertThat(second.convertToEntityAttribute(encrypted)).isNull();
        assertThat(first.convertToEntityAttribute(encrypted)).isEqualTo("secret-value");
    }

    @Test
    @DisplayName("Legacy AES-128 values written by the previous implementation remain readable")
    void testLegacyAes128ValueIsStillDecryptable() throws Exception {
        String plainText = "sk-legacy-provider-key";
        String legacyPayload = encryptWithLegacyTruncatedKey(plainText);

        AesEncryptionConverter converter = new AesEncryptionConverter(VALID_KEY);
        assertThat(converter.convertToEntityAttribute(legacyPayload)).isEqualTo(plainText);
    }

    @Test
    @DisplayName("Undecryptable stored values return null instead of leaking raw ciphertext")
    void testUndecryptableValueDoesNotReturnRawStoredValue() {
        AesEncryptionConverter converter = new AesEncryptionConverter(VALID_KEY);

        String notEncrypted = "plain-text-that-was-never-encrypted";
        assertThat(converter.convertToEntityAttribute(notEncrypted)).isNull();

        String corrupted = "gcm:v1:" + Base64.getEncoder().encodeToString("too-short".getBytes(StandardCharsets.UTF_8));
        assertThat(converter.convertToEntityAttribute(corrupted)).isNull();
    }

    @Test
    @DisplayName("Null and blank attributes return original value without error")
    void testNullOrBlankHandling() {
        AesEncryptionConverter converter = new AesEncryptionConverter(VALID_KEY);

        assertThat(converter.convertToDatabaseColumn(null)).isNull();
        assertThat(converter.convertToDatabaseColumn("")).isEmpty();
        assertThat(converter.convertToEntityAttribute(null)).isNull();
        assertThat(converter.convertToEntityAttribute("")).isEmpty();
    }

    /** Reproduces the old format: AES-GCM keyed by the secret truncated to its first 16 bytes. */
    private String encryptWithLegacyTruncatedKey(String plainText) throws Exception {
        byte[] iv = new byte[12];
        new java.security.SecureRandom().nextBytes(iv);
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE,
                new SecretKeySpec(VALID_KEY.substring(0, 16).getBytes(StandardCharsets.UTF_8), "AES"),
                new GCMParameterSpec(128, iv));
        byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

        ByteBuffer buffer = ByteBuffer.allocate(iv.length + cipherText.length);
        buffer.put(iv);
        buffer.put(cipherText);
        return "gcm:v1:" + Base64.getEncoder().encodeToString(buffer.array());
    }
}
