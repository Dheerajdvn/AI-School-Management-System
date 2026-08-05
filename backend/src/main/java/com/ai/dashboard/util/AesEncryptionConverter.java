package com.ai.dashboard.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Converter
@Component
public class AesEncryptionConverter implements AttributeConverter<String, String> {

    private static final String ALGORITHM = "AES";
    private static final byte[] DEFAULT_KEY = "1234567890123456".getBytes(StandardCharsets.UTF_8); // 16 bytes default fallback

    private static SecretKeySpec secretKeySpec = new SecretKeySpec(DEFAULT_KEY, ALGORITHM);

    @Value("${app.security.encryption-key:}")
    public void setSecretKey(String key) {
        byte[] keyBytes;
        if (key != null && key.trim().length() >= 16) {
            keyBytes = key.trim().substring(0, 16).getBytes(StandardCharsets.UTF_8);
        } else {
            String activeProfile = System.getProperty("spring.profiles.active", "dev");
            if ("prod".equalsIgnoreCase(activeProfile) || "production".equalsIgnoreCase(activeProfile)) {
                log.warn("APP_ENCRYPTION_KEY / app.security.encryption-key property missing or too short in prod, using fallback 16-byte key");
            }
            // 16 bytes default key (128-bit AES)
            keyBytes = "1234567890123456".getBytes(StandardCharsets.UTF_8);
        }
        secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM);
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isBlank()) {
            return attribute;
        }
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
            byte[] encrypted = cipher.doFinal(attribute.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            log.error("Error encrypting string attribute", e);
            throw new RuntimeException("Encryption error", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return dbData;
        }
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
            byte[] decoded = Base64.getDecoder().decode(dbData);
            byte[] original = cipher.doFinal(decoded);
            return new String(original, StandardCharsets.UTF_8);
        } catch (Exception e) {
            // In case existing data in DB was plain text
            return dbData;
        }
    }
}
