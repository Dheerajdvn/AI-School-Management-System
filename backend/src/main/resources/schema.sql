-- =============================================================
--  AI Student Dashboard - schema.sql (PostgreSQL Dialect)
--  NOTE: Hibernate (ddl-auto=update) manages tables automatically.
-- =============================================================

-- Role table for RBAC
CREATE TABLE IF NOT EXISTS roles (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id                      BIGSERIAL PRIMARY KEY,
    username                VARCHAR(50)  NOT NULL UNIQUE,
    email                   VARCHAR(100) NOT NULL UNIQUE,
    password                VARCHAR(255) NOT NULL,
    enabled                 BOOLEAN      NOT NULL DEFAULT TRUE,
    account_non_expired     BOOLEAN      NOT NULL DEFAULT TRUE,
    account_non_locked      BOOLEAN      NOT NULL DEFAULT TRUE,
    credentials_non_expired BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Seed default roles
INSERT INTO roles (name) VALUES
    ('ROLE_SUPER_ADMIN'),
    ('ROLE_ADMIN'),
    ('ROLE_SCHOOL_ADMIN'),
    ('ROLE_TEACHER'),
    ('ROLE_STUDENT')
ON CONFLICT (name) DO NOTHING;