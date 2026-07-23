package com.ai.dashboard.document.parser;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Parser for plain text documents.
 */
@Slf4j
@Component
public class TxtParser implements DocumentParser {

    @Override
    public String extractText(String filePath) {
        log.debug("Extracting text from TXT: {}", filePath);
        try {
            String text = Files.readString(Path.of(filePath));
            log.debug("Extracted {} characters from TXT", text.length());
            return text;
        } catch (IOException e) {
            log.error("Failed to extract text from TXT: {}", filePath, e);
            throw new IllegalArgumentException("Failed to parse TXT: " + e.getMessage());
        }
    }

    @Override
    public boolean supports(String extension) {
        return "txt".equalsIgnoreCase(extension);
    }
}