package com.ai.dashboard.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Encrypts sensitive string columns (currently user-supplied LLM provider API keys) at rest.
 *
 * <p>New values are written as AES-256-GCM, keyed by the SHA-256 digest of the configured secret.
 * Values written by the previous implementation — which truncated the secret to 16 bytes, giving
 * AES-128 — are still readable via {@link #legacySecretKey} so that rotating to this version does
 * not require users to re-enter their API keys, provided the same secret is kept.</p>
 *
 * <p>There is deliberately no default key: a missing or too-short secret fails at startup rather
 * than silently encrypting with a well-known value.</p>
 */
@Slf4j
@Converter
@Component
public class AesEncryptionConverter implements AttributeConverter<String, String> {

    private static final String GCM_TRANSFORMATION = "AES/GCM/NoPadding";
    private static final String GCM_PREFIX = "gcm:v1:";
    private static final int GCM_IV_LENGTH = 12; // 96-bit IV
    private static final int GCM_TAG_LENGTH = 128; // 128-bit authentication tag
    private static final int LEGACY_KEY_LENGTH = 16; // pre-existing AES-128 truncation
    private static final int MIN_KEY_LENGTH = 32;

    private final SecretKey secretKey;

    /** Decrypt-only key reproducing the old 16-byte truncation, so existing rows stay readable. */
    private final SecretKey legacySecretKey;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Deliberately the only constructor. Adding a no-arg one makes Spring prefer it over this
     * {@code @Value}-annotated variant (no {@code @Autowired} candidate means the default constructor
     * wins), so the configured key is never injected and every context boot fails with
     * "No encryption key configured" regardless of configuration. Pass {@code null} explicitly to
     * exercise the missing-key path.
     */
    public AesEncryptionConverter(@Value("${app.security.encryption-key:${APP_ENCRYPTION_KEY:}}") String key) {
        String resolved = firstNonBlank(key, System.getenv("APP_ENCRYPTION_KEY"));

        if (resolved == null) {
            throw new IllegalStateException(
                    "No encryption key configured. Set APP_ENCRYPTION_KEY (or app.security.encryption-key) "
                            + "to a random secret of at least " + MIN_KEY_LENGTH + " characters. "
                            + "Refusing to start with a built-in default key.");
        }
        if (resolved.length() < MIN_KEY_LENGTH) {
            throw new IllegalStateException(
                    "Configured encryption key is too short (" + resolved.length() + " characters). "
                            + "Provide at least " + MIN_KEY_LENGTH + " characters of random secret.");
        }

        this.secretKey = new SecretKeySpec(sha256(resolved), "AES");
        this.legacySecretKey = new SecretKeySpec(
                resolved.substring(0, LEGACY_KEY_LENGTH).getBytes(StandardCharsets.UTF_8), "AES");
    }

    private static String firstNonBlank(String... candidates) {
        for (String candidate : candidates) {
            if (candidate != null && !candidate.trim().isEmpty()) {
                return candidate.trim();
            }
        }
        return null;
    }

    private static byte[] sha256(String value) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 is unavailable; cannot derive encryption key", e);
        }
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isBlank()) {
            return attribute;
        }
        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(GCM_TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
            byte[] cipherText = cipher.doFinal(attribute.getBytes(StandardCharsets.UTF_8));

            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + cipherText.length);
            byteBuffer.put(iv);
            byteBuffer.put(cipherText);

            return GCM_PREFIX + Base64.getEncoder().encodeToString(byteBuffer.array());
        } catch (Exception e) {
            log.error("Error encrypting string attribute with AES-GCM", e);
            throw new RuntimeException("Encryption error", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return dbData;
        }
        if (!dbData.startsWith(GCM_PREFIX)) {
            // Anything without the marker predates GCM and is not recoverable under the current key
            // derivation. Never return the stored bytes as if they were the plaintext value.
            log.error("Encrypted attribute is missing the '{}' marker and cannot be decrypted; "
                    + "the stored secret must be re-entered", GCM_PREFIX);
            return null;
        }

        byte[] decoded;
        byte[] iv = new byte[GCM_IV_LENGTH];
        byte[] cipherText;
        try {
            decoded = Base64.getDecoder().decode(dbData.substring(GCM_PREFIX.length()));
            if (decoded.length <= GCM_IV_LENGTH) {
                throw new IllegalArgumentException("Invalid encrypted payload length");
            }
            ByteBuffer byteBuffer = ByteBuffer.wrap(decoded);
            byteBuffer.get(iv);
            cipherText = new byte[byteBuffer.remaining()];
            byteBuffer.get(cipherText);
        } catch (Exception e) {
            log.error("Encrypted attribute is malformed and cannot be decrypted", e);
            return null;
        }

        String plainText = decrypt(secretKey, iv, cipherText);
        if (plainText == null) {
            // Written before the AES-256 upgrade, when the key was truncated to 16 bytes.
            plainText = decrypt(legacySecretKey, iv, cipherText);
            if (plainText != null) {
                log.info("Decrypted a legacy AES-128 value; it will be re-encrypted as AES-256 on next write");
            }
        }
        if (plainText == null) {
            // Returning the ciphertext here would let an unusable value flow onward as if it were
            // the real secret, so surface the failure as an absent value instead.
            log.error("Failed to decrypt attribute with the configured encryption key; "
                    + "the key may have changed and the stored secret must be re-entered");
        }
        return plainText;
    }

    private String decrypt(SecretKey key, byte[] iv, byte[] cipherText) {
        try {
            Cipher cipher = Cipher.getInstance(GCM_TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
            return new String(cipher.doFinal(cipherText), StandardCharsets.UTF_8);
        } catch (Exception e) {
            return null;
        }
    }
}
