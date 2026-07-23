package com.ai.dashboard.document.repository;

import com.ai.dashboard.document.entity.Document;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/**
 * Specifications for filtering Document entities.
 */
public class DocumentSpecifications {

    public static Specification<Document> hasCourseId(Long courseId) {
        return (root, query, cb) -> {
            if (courseId == null) return null;
            return cb.equal(root.get("course").get("id"), courseId);
        };
    }

    public static Specification<Document> hasDocumentType(String documentType) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(documentType)) return null;
            try {
                Document.DocumentType dt = Document.DocumentType.valueOf(documentType);
                return cb.equal(root.get("documentType"), dt);
            } catch (IllegalArgumentException e) {
                return null; // invalid type will be validated upstream
            }
        };
    }

    public static Specification<Document> matchesQuery(String q) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(q)) return null;
            String pattern = "%" + q.toLowerCase().replace("%", "\\%") + "%";
            return cb.like(cb.lower(root.get("originalFilename")), pattern);
        };
    }
}
