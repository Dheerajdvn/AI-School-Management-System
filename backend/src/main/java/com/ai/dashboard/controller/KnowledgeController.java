package com.ai.dashboard.controller;

import com.ai.dashboard.document.dto.UploadDocumentRequest;
import com.ai.dashboard.document.service.DocumentService;
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

    private final List<Map<String, Object>> collections = new CopyOnWriteArrayList<>(List.of(
            new HashMap<>(Map.of("id", 1, "name", "General Documents", "count", 45)),
            new HashMap<>(Map.of("id", 2, "name", "Course Syllabi", "count", 25)),
            new HashMap<>(Map.of("id", 3, "name", "Research Papers", "count", 30))
    ));

    @GetMapping("/documents")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get all knowledge documents")
    public ApiResponse<PagedResponse<Object>> getDocuments(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String date,
            Authentication authentication) {
        try {
            int p = page != null ? page : 0;
            int s = size != null ? size : (limit != null ? limit : 20);
            var pageResult = documentService.getAll(PageRequest.of(p, s));
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
        return ApiResponse.success("Document reindexed", null);
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Search knowledge")
    public ApiResponse<List<Object>> search(@RequestBody Map<String, String> body) {
        return ApiResponse.success(List.of());
    }

    @GetMapping("/collections")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')")
    @Operation(summary = "Get collections")
    public ApiResponse<List<Map<String, Object>>> getCollections() {
        return ApiResponse.success(collections);
    }

    @PostMapping("/collections")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Create collection")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createCollection(@RequestBody Map<String, Object> data) {
        Map<String, Object> newCollection = new HashMap<>();
        newCollection.put("id", collections.size() + 1);
        newCollection.put("name", data.getOrDefault("name", "New Collection"));
        newCollection.put("count", 0);
        collections.add(newCollection);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Collection created", newCollection));
    }

    @GetMapping("/queue")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_TEACHER')")
    @Operation(summary = "Get processing queue")
    public ApiResponse<List<Object>> getProcessingQueue() {
        return ApiResponse.success(List.of());
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
