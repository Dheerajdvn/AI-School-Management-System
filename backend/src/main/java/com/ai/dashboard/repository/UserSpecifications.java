package com.ai.dashboard.repository;

import com.ai.dashboard.entity.Role;
import com.ai.dashboard.entity.User;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import java.util.Locale;

public final class UserSpecifications {

    private UserSpecifications() {}

    public static Specification<User> matchesQuery(String q) {
        return (root, query, cb) -> {
            if (q == null || q.trim().isEmpty()) return cb.conjunction();
            String like = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("username")), like),
                    cb.like(cb.lower(root.get("email")), like)
            );
        };
    }

    public static Specification<User> hasRole(String roleName) {
        return (root, query, cb) -> {
            if (roleName == null || roleName.trim().isEmpty()) {
                return cb.conjunction();
            }
            if (query != null) {
                query.distinct(true);
            }
            Join<User, Role> roleJoin = root.join("roles", JoinType.LEFT);
            return cb.equal(roleJoin.get("name"), roleName);
        };
    }
}
