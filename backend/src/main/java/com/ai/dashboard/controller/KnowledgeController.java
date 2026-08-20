package com.ai.dashboard.controller;

import com.ai.dashboard.document.dto.UploadDocumentRequest;
import com.ai.dashboard.document.dto.KnowledgeDashboardResponse;
import com.ai.dashboard.document.service.DocumentService;
import com.ai.dashboard.document.service.KnowledgeDashboardService;
import com.ai.dashboard.document.repository.DocumentContentRepository;
import com.ai.dashboard.document.entity.DocumentContent;
import com.ai.dashboard.dto.ApiResponse;
import com.ai.dashboard.dto.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@RestController
@RequestMapping("/knowledge")
@RequiredArgsConstructor
@Tag(name = "Knowledge Center", description = "AI Knowledge Center APIs")
public class KnowledgeController {

    private final DocumentService documentService;
    private final DocumentContentRepository documentContentRepository;
    private final KnowledgeDashboardService knowledgeDashboardService;
    private final com.ai.dashboard.ai.rag.service.RagService ragService;
    private final com.ai.dashboard.document.repository.DocumentRepository documentRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_SCHOOL_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Get AI Knowledge dashboard statistics")
    public ApiResponse<KnowledgeDashboardResponse> getDashboardStats() {
        KnowledgeDashboardResponse response = knowledgeDashboardService.getDashboardStats();
        return ApiResponse.success(response);
    }

    @GetMapping("/documents")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get all knowledge documents")
    public ApiResponse<PagedResponse<Object>> getDocuments(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String documentType,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long courseId,
            Authentication authentication) {
        try {
            int p = page != null ? page : 0;
            int s = size != null ? size : (limit != null ? limit : 20);
            
            String resolvedType = documentType != null ? documentType : type;

            org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "uploadTime");
            if ("id".equalsIgnoreCase(sortBy)) {
                sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id");
            }

            var pageResult = documentService.getAll(PageRequest.of(p, s, sort), search, resolvedType, courseId);
            PagedResponse<Object> paged = PagedResponse.builder()
                    .content(List.copyOf(pageResult.getContent()))
                    .page(pageResult.getNumber())
                    .size(pageResult.getSize())
                    .totalElements(pageResult.getTotalElements())
                    .totalPages(pageResult.getTotalPages())
                    .first(pageResult.isFirst())
                    .last(pageResult.isLast())
                    .build();
            return ApiResponse.success(paged);
        } catch (Exception e) {
            log.error("Error fetching knowledge documents: {}", e.getMessage(), e);
            return ApiResponse.success(PagedResponse.builder()
                    .content(List.of())
                    .page(0)
                    .size(20)
                    .totalElements(0)
                    .totalPages(0)
                    .first(true)
                    .last(true)
                    .build());
        }
    }

    @PostMapping("/documents")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Upload knowledge document")
    public ResponseEntity<ApiResponse<Object>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        UploadDocumentRequest req = new UploadDocumentRequest();
        req.setFile(file);
        Long userId = extractUserId(authentication);
        var res = documentService.upload(req, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Document uploaded", res));
    }

    @GetMapping("/documents/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get knowledge document by ID")
    public ApiResponse<Map<String, Object>> getDocumentById(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Getting knowledge document by id: {}", id);
        var docRes = documentService.getById(id, extractUserId(authentication), getCurrentUserRole(authentication));
        var contentOpt = documentContentRepository.findByDocumentId(id);

        Map<String, Object> map = new HashMap<>();
        map.put("id", docRes.getId());
        map.put("filename", docRes.getFilename());
        map.put("name", docRes.getOriginalFilename());
        map.put("title", docRes.getOriginalFilename());
        map.put("originalFilename", docRes.getOriginalFilename());
        map.put("contentType", docRes.getContentType());
        map.put("fileSize", docRes.getFileSize());
        map.put("size", formatFileSize(docRes.getFileSize()));
        map.put("uploadedById", docRes.getUploadedById());
        map.put("uploadedBy", docRes.getUploadedByName());
        map.put("uploadTime", docRes.getUploadTime());
        map.put("date", docRes.getUploadTime() != null ? docRes.getUploadTime().toString().substring(0, 10) : "");
        map.put("type", docRes.getDocumentType());
        map.put("subject", docRes.getCourseCode() != null ? docRes.getCourseCode() : "General");
        map.put("collection", "General");
        map.put("status", docRes.getProcessingStatus());
        map.put("chunks", 5);
        map.put("embeddings", 5);
        map.put("extractedText", contentOpt.map(c -> c.getExtractedText()).orElse("No extracted text available"));
        map.put("content", contentOpt.map(c -> c.getExtractedText()).orElse("No extracted text available"));

        return ApiResponse.success(map);
    }

    private String formatFileSize(Long size) {
        if (size == null) return "0 KB";
        if (size < 1024) return size + " B";
        if (size < 1024 * 1024) return String.format("%.1f KB", size / 1024.0);
        return String.format("%.1f MB", size / (1024.0 * 1024.0));
    }

    @DeleteMapping("/documents/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Delete knowledge document")
    public ApiResponse<Void> deleteDocument(@PathVariable Long id, Authentication authentication) {
        documentService.delete(id, extractUserId(authentication), getCurrentUserRole(authentication));
        return ApiResponse.success("Document deleted", null);
    }

    @PostMapping("/documents/{id}/reindex")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Reindex document")
    public ApiResponse<Void> reindexDocument(@PathVariable Long id) {
        ragService.reindexDocument(id);
        return ApiResponse.success("Document reindexed successfully", null);
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Search knowledge")
    public ApiResponse<Object> search(@RequestBody Map<String, String> body) {
        String query = body.getOrDefault("query", body.getOrDefault("question", body.get("search")));
        if (query == null || query.isBlank()) {
            return ApiResponse.success(List.of());
        }
        var response = ragService.answerQuestion(query);
        return ApiResponse.success(response);
    }

    @GetMapping("/collections")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get collections")
    public ApiResponse<List<Map<String, Object>>> getCollections() {
        List<Object[]> rows = documentRepository.countDocumentsByCollection();
        List<Map<String, Object>> result = new ArrayList<>();
        int id = 1;
        for (Object[] row : rows) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", id++);
            item.put("name", row[0] != null ? row[0].toString() : "General");
            item.put("count", row[1] != null ? ((Number) row[1]).longValue() : 0L);
            result.add(item);
        }
        if (result.isEmpty()) {
            result.add(Map.of("id", 1, "name", "General Documents", "count", 0L));
        }
        return ApiResponse.success(result);
    }

    @GetMapping("/queue")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Get processing queue")
    public ApiResponse<List<Map<String, Object>>> getProcessingQueue() {
        var page = documentRepository.findAll(
                PageRequest.of(0, 50, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "uploadTime"))
        );
        List<Map<String, Object>> queue = page.getContent().stream()
                .filter(d -> d.getProcessingStatus() == com.ai.dashboard.document.entity.Document.ProcessingStatus.PENDING
                        || d.getProcessingStatus() == com.ai.dashboard.document.entity.Document.ProcessingStatus.PROCESSING)
                .map(d -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", d.getId());
                    map.put("filename", d.getOriginalFilename());
                    map.put("status", d.getProcessingStatus().name());
                    map.put("uploadedAt", d.getUploadTime());
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
        return ApiResponse.success(queue);
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication == null) {
            return null;
        }
        Object credentials = authentication.getCredentials();
        return credentials instanceof Long ? (Long) credentials : null;
    }

    private String getCurrentUserRole(Authentication authentication) {
        if (authentication == null) {
            return "ROLE_STUDENT";
        }
        return authentication.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("ROLE_STUDENT");
    }
}
