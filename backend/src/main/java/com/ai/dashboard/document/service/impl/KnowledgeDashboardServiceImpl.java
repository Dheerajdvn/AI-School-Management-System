package com.ai.dashboard.document.service.impl;

import com.ai.dashboard.document.dto.DocumentResponse;
import com.ai.dashboard.document.dto.KnowledgeDashboardResponse;
import com.ai.dashboard.document.entity.Document;
import com.ai.dashboard.document.repository.DocumentRepository;
import com.ai.dashboard.document.service.KnowledgeDashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of {@link KnowledgeDashboardService} for AI Knowledge Center metrics.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeDashboardServiceImpl implements KnowledgeDashboardService {

    private final DocumentRepository documentRepository;

    @Override
    @Transactional(readOnly = true)
    public KnowledgeDashboardResponse getDashboardStats() {
        log.debug("Fetching AI Knowledge Dashboard statistics");

        long totalDocuments = documentRepository.count();

        long indexedDocuments = documentRepository.countByProcessingStatus(Document.ProcessingStatus.COMPLETED);
        long pendingDocuments = documentRepository.countByProcessingStatusIn(List.of(
                Document.ProcessingStatus.PENDING,
                Document.ProcessingStatus.PROCESSING
        ));
        long failedDocuments = documentRepository.countByProcessingStatus(Document.ProcessingStatus.FAILED);

        List<Document> recentEntities = documentRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "uploadTime"))
        ).getContent();

        List<DocumentResponse> recentUploads = recentEntities.stream()
                .map(this::toDocumentResponse)
                .toList();

        // 1. uploadsPerDay (Last 7 Days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(6).withHour(0).withMinute(0).withSecond(0);
        Map<String, Long> last7DaysMap = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            last7DaysMap.put(LocalDate.now().minusDays(i).toString(), 0L);
        }
        List<Object[]> rawUploads = documentRepository.countUploadsPerDaySince(sevenDaysAgo);
        for (Object[] row : rawUploads) {
            if (row[0] != null && row[1] != null) {
                String dateStr = row[0].toString();
                Long count = ((Number) row[1]).longValue();
                if (last7DaysMap.containsKey(dateStr)) {
                    last7DaysMap.put(dateStr, count);
                }
            }
        }
        List<Object> uploadsPerDay = last7DaysMap.entrySet().stream()
                .map(entry -> Map.<String, Object>of("date", entry.getKey(), "count", entry.getValue()))
                .collect(Collectors.toList());

        // 2. documentsByCollection
        List<Object[]> rawCollections = documentRepository.countDocumentsByCollection();
        List<Object> documentsByCollection = rawCollections.stream()
                .map(row -> Map.<String, Object>of(
                        "name", row[0] != null ? row[0].toString() : "General",
                        "count", row[1] != null ? ((Number) row[1]).longValue() : 0L
                ))
                .collect(Collectors.toList());

        long totalCollections = documentsByCollection.isEmpty() ? 0L : documentsByCollection.size();

        // 3. documentsByType
        List<Object[]> rawTypes = documentRepository.countDocumentsByType();
        List<Object> documentsByType = rawTypes.stream()
                .map(row -> Map.<String, Object>of(
                        "name", row[0] != null ? row[0].toString() : "OTHER",
                        "type", row[0] != null ? row[0].toString() : "OTHER",
                        "count", row[1] != null ? ((Number) row[1]).longValue() : 0L
                ))
                .collect(Collectors.toList());

        return KnowledgeDashboardResponse.builder()
                .totalDocuments(totalDocuments)
                .totalCollections(totalCollections)
                .indexedDocuments(indexedDocuments)
                .pendingDocuments(pendingDocuments)
                .failedDocuments(failedDocuments)
                .recentUploads(recentUploads)
                .uploadsPerDay(uploadsPerDay)
                .documentsByCollection(documentsByCollection)
                .documentsByType(documentsByType)
                .build();
    }

    private DocumentResponse toDocumentResponse(Document document) {
        return DocumentResponse.builder()
                .id(document.getId())
                .filename(document.getFilename())
                .originalFilename(document.getOriginalFilename())
                .contentType(document.getContentType())
                .fileSize(document.getFileSize())
                .uploadedById(document.getUploadedBy() != null ? document.getUploadedBy().getId() : null)
                .uploadedByName(document.getUploadedBy() != null ? document.getUploadedBy().getUsername() : null)
                .uploadTime(document.getUploadTime())
                .documentType(document.getDocumentType() != null ? document.getDocumentType().name() : null)
                .courseId(document.getCourse() != null ? document.getCourse().getId() : null)
                .courseCode(document.getCourse() != null ? document.getCourse().getCourseCode() : null)
                .processingStatus(document.getProcessingStatus() != null ? document.getProcessingStatus().name() : null)
                .build();
    }
}
