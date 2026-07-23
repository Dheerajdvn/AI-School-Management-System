package com.ai.dashboard.document.parser;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Parser for Markdown documents.
 *
 * <p>Strips Markdown syntax (headings, bold, italic, code fences, lists, links,
 * images, horizontal rules) and returns clean plain text.</p>
 */
@Slf4j
@Component
public class MarkdownParser implements DocumentParser {

    @Override
    public String extractText(String filePath) {
        log.debug("Extracting text from Markdown: {}", filePath);
        try {
            String raw = Files.readString(Path.of(filePath));
            String text = stripMarkdown(raw);
            log.debug("Extracted {} characters from Markdown", text.length());
            return text;
        } catch (IOException e) {
            log.error("Failed to extract text from Markdown: {}", filePath, e);
            throw new IllegalArgumentException("Failed to parse Markdown: " + e.getMessage());
        }
    }

    @Override
    public boolean supports(String extension) {
        return "md".equalsIgnoreCase(extension);
    }

    /**
     * Remove common Markdown formatting, leaving plain text.
     */
    private String stripMarkdown(String markdown) {
        if (markdown == null || markdown.isBlank()) {
            return markdown;
        }

        String text = markdown;

        // Remove code fences (``` ... ```)
        text = text.replaceAll("(?s)```.*?```", "");

        // Remove inline code (`code`)
        text = text.replaceAll("`[^`]+`", "");

        // Remove images ![alt](url)
        text = text.replaceAll("!\\[[^\\]]*\\]\\([^)]*\\)", "");

        // Remove links [text](url) → text
        text = text.replaceAll("\\[([^\\]]*)\\]\\([^)]*\\)", "$1");

        // Remove heading markers (#)
        text = text.replaceAll("^#{1,6}\\s+", "");

        // Remove bold/italic markers
        text = text.replaceAll("\\*\\*|__", "");
        text = text.replaceAll("\\*|_", "");

        // Remove horizontal rules
        text = text.replaceAll("^[-*_]{3,}\\s*$", "");

        // Remove blockquote markers
        text = text.replaceAll("^>\\s+", "");

        // Remove unordered list markers
        text = text.replaceAll("^[\\s]*[-*+]\\s+", "");

        // Remove ordered list markers
        text = text.replaceAll("^[\\s]*\\d+\\.\\s+", "");

        // Collapse multiple blank lines into one
        text = text.replaceAll("\\n{3,}", "\n\n");

        return text.trim();
    }
}