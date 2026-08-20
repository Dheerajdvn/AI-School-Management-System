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
import java.security.SecureRandom;
import java.util.Base64;

@Slf4j
@Converter
@Component
public class AesEncryptionConverter implements AttributeConverter<String, String> {

    private static final String GCM_TRANSFORMATION = "AES/GCM/NoPadding";
    private static final String LEGACY_TRANSFORMATION = "AES";
    private static final String GCM_PREFIX = "gcm:v1:";
    private static final int GCM_IV_LENGTH = 12; // 96-bit IV
    private static final int GCM_TAG_LENGTH = 128; // 128-bit authentication tag

    private final SecretKey secretKey;
    private final SecureRandom secureRandom = new SecureRandom();

    public AesEncryptionConverter() {
        this(null);
    }

    public AesEncryptionConverter(@Value("${app.security.encryption-key:${APP_ENCRYPTION_KEY:}}") String key) {
        byte[] keyBytes;
        if (key != null && key.trim().length() >= 16) {
            keyBytes = key.trim().substring(0, 16).getBytes(StandardCharsets.UTF_8);
        } else {
            String envKey = System.getenv("APP_ENCRYPTION_KEY");
            if (envKey != null && envKey.trim().length() >= 16) {
                keyBytes = envKey.trim().substring(0, 16).getBytes(StandardCharsets.UTF_8);
            } else {
                keyBytes = "1234567890123456".getBytes(StandardCharsets.UTF_8);
            }
        }
        this.secretKey = new SecretKeySpec(keyBytes, "AES");
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
        try {
            if (dbData.startsWith(GCM_PREFIX)) {
                String base64Payload = dbData.substring(GCM_PREFIX.length());
                byte[] decoded = Base64.getDecoder().decode(base64Payload);
                if (decoded.length < GCM_IV_LENGTH) {
                    throw new IllegalArgumentException("Invalid encrypted payload length");
                }

                ByteBuffer byteBuffer = ByteBuffer.wrap(decoded);
                byte[] iv = new byte[GCM_IV_LENGTH];
                byteBuffer.get(iv);
                byte[] cipherText = new byte[byteBuffer.remaining()];
                byteBuffer.get(cipherText);

                Cipher cipher = Cipher.getInstance(GCM_TRANSFORMATION);
                cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
                byte[] plainText = cipher.doFinal(cipherText);
                return new String(plainText, StandardCharsets.UTF_8);
            }

            // Fallback for legacy ECB encrypted data
            try {
                Cipher legacyCipher = Cipher.getInstance(LEGACY_TRANSFORMATION);
                legacyCipher.init(Cipher.DECRYPT_MODE, secretKey);
                byte[] decoded = Base64.getDecoder().decode(dbData);
                byte[] original = legacyCipher.doFinal(decoded);
                return new String(original, StandardCharsets.UTF_8);
            } catch (Exception legacyEx) {
                // If it wasn't ECB encrypted, return as raw plain text
                return dbData;
            }
        } catch (Exception e) {
            log.error("Error decrypting attribute", e);
            return dbData;
        }
    }
}

