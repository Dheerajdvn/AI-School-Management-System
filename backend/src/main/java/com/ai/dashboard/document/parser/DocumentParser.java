package com.ai.dashboard.document.parser;

/**
 * Interface for document text parsers.
 */
public interface DocumentParser {

    /**
     * Extract text from a file at the given path.
     *
     * @param filePath the path to the file
     * @return the extracted text
     */
    String extractText(String filePath);

    /**
     * Check if this parser supports the given file extension.
     *
     * @param extension the file extension (e.g. "pdf", "txt")
     * @return true if supported
     */
    boolean supports(String extension);
}
