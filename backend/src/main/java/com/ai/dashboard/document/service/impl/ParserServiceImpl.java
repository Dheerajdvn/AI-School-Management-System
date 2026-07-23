package com.ai.dashboard.document.service.impl;

import com.ai.dashboard.document.entity.Document;
import com.ai.dashboard.document.entity.DocumentContent;
import com.ai.dashboard.document.parser.DocumentParser;
import com.ai.dashboard.document.repository.DocumentContentRepository;
import com.ai.dashboard.document.repository.DocumentRepository;
import com.ai.dashboard.document.service.ParserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Orchestrates text extraction by selecting the correct parser for a document's
 * file type, persisting the extracted content, and updating the document's
 * processing status.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ParserServiceImpl implements ParserService {

    private final List<DocumentParser> parsers;
    private final DocumentRepository documentRepository;
    private final DocumentContentRepository documentContentRepository;

    @Override
    @Transactional
    public void extractText(Document document) {
        String extension = getExtension(document.getOriginalFilename());
        log.info("Extracting text for document {} (type: {})", document.getId(), extension);

        DocumentParser parser = findParser(extension);
        if (parser == null) {
            log.warn("No parser found for extension '{}' on document {}", extension, document.getId());
            document.setProcessingStatus(Document.ProcessingStatus.FAILED);
            documentRepository.save(document);
            return;
        }

        try {
            String text = parser.extractText(document.getStoragePath());

            DocumentContent content = DocumentContent.builder()
                    .document(document)
                    .extractedText(text)
                    .extractedAt(LocalDateTime.now())
                    .build();

            documentContentRepository.save(content);

            document.setProcessingStatus(Document.ProcessingStatus.COMPLETED);
            documentRepository.save(document);

            log.info("Text extraction completed for document {} ({} chars)", document.getId(), text.length());
        } catch (Exception e) {
            log.error("Text extraction failed for document {}: {}", document.getId(), e.getMessage());
            document.setProcessingStatus(Document.ProcessingStatus.FAILED);
            documentRepository.save(document);
        }
    }

    private DocumentParser findParser(String extension) {
        for (DocumentParser parser : parsers) {
            if (parser.supports(extension)) {
                return parser;
            }
        }
        return null;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}