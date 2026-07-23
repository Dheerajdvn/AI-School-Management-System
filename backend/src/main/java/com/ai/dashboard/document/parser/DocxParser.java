package com.ai.dashboard.document.parser;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;

/**
 * Parser for DOCX documents using Apache POI.
 */
@Slf4j
@Component
public class DocxParser implements DocumentParser {

    @Override
    public String extractText(String filePath) {
        log.debug("Extracting text from DOCX: {}", filePath);
        try (FileInputStream fis = new FileInputStream(Path.of(filePath).toFile());
             XWPFDocument document = new XWPFDocument(fis)) {
            XWPFWordExtractor extractor = new XWPFWordExtractor(document);
            String text = extractor.getText();
            log.debug("Extracted {} characters from DOCX", text.length());
            return text;
        } catch (IOException e) {
            log.error("Failed to extract text from DOCX: {}", filePath, e);
            throw new IllegalArgumentException("Failed to parse DOCX: " + e.getMessage());
        }
    }

    @Override
    public boolean supports(String extension) {
        return "docx".equalsIgnoreCase(extension);
    }
}