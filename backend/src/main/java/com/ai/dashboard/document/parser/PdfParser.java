package com.ai.dashboard.document.parser;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Path;

/**
 * Parser for PDF documents using Apache PDFBox.
 */
@Slf4j
@Component
public class PdfParser implements DocumentParser {

    @Override
    public String extractText(String filePath) {
        log.debug("Extracting text from PDF: {}", filePath);
        try (PDDocument document = Loader.loadPDF(Path.of(filePath).toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            log.debug("Extracted {} characters from PDF", text.length());
            return text;
        } catch (IOException e) {
            log.error("Failed to extract text from PDF: {}", filePath, e);
            throw new IllegalArgumentException("Failed to parse PDF: " + e.getMessage());
        }
    }

    @Override
    public boolean supports(String extension) {
        return "pdf".equalsIgnoreCase(extension);
    }
}
