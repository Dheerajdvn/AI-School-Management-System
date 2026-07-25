package com.ai.dashboard.document.parser;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

/**
 * Parser for PDF documents using Apache PDFBox with robust fallback.
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
            if (text == null || text.isBlank()) {
                text = "[PDF Document uploaded successfully - no embedded text layer found (scanned or image-based PDF)]";
            }
            log.debug("Extracted {} characters from PDF", text.length());
            return text;
        } catch (Exception e) {
            log.warn("Failed to extract text from PDF: {}, falling back to placeholder", filePath, e);
            return "[PDF Document uploaded successfully - text extraction fallback]";
        }
    }

    @Override
    public boolean supports(String extension) {
        return "pdf".equalsIgnoreCase(extension);
    }
}
