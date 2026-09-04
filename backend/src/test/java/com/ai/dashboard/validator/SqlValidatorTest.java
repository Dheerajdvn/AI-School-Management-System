package com.ai.dashboard.validator;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for {@link SqlValidator}.
 */
class SqlValidatorTest {

    private final SqlValidator validator = new SqlValidator();

    @Test
    void allowsSimpleSelect() {
        var r = validator.validate("SELECT * FROM student LIMIT 10");
        assertTrue(r.valid());
    }

    @Test
    void allowsWithCte() {
        var r = validator.validate("WITH cte AS (SELECT * FROM student) SELECT * FROM cte");
        assertTrue(r.valid());
    }

    @Test
    void rejectsDelete() {
        var r = validator.validate("DELETE FROM student");
        assertFalse(r.valid());
    }

    @Test
    void rejectsDrop() {
        var r = validator.validate("DROP TABLE student");
        assertFalse(r.valid());
    }

    @Test
    void rejectsUpdate() {
        var r = validator.validate("UPDATE student SET fee = 0");
        assertFalse(r.valid());
    }

    @Test
    void rejectsTruncate() {
        var r = validator.validate("TRUNCATE TABLE student");
        assertFalse(r.valid());
    }

    @Test
    void rejectsMultiStatement() {
        var r = validator.validate("SELECT 1; DROP TABLE student");
        assertFalse(r.valid());
    }

    @Test
    void rejectsInformationSchema() {
        var r = validator.validate("SELECT * FROM information_schema.tables");
        assertFalse(r.valid());
    }

    @Test
    void rejectsBlank() {
        assertFalse(validator.validate("   ").valid());
    }

    @Test
    void rejectsUsersTable() {
        var r = validator.validate("SELECT * FROM users");
        assertFalse(r.valid());
        assertTrue(r.reason().contains("not allowed"));
    }

    @Test
    void rejectsJoinOntoNonWhitelistedTable() {
        var r = validator.validate("SELECT s.name FROM student s JOIN users u ON u.id = s.id");
        assertFalse(r.valid());
    }

    @Test
    void rejectsTablesOutsideTheDemoDataset() {
        // These were whitelisted while the system prompt never described them; the AI is scoped to
        // the demo dataset only, so operational tables must stay unreachable.
        for (String table : new String[] { "courses", "enrollments", "submissions", "grade_history", "documents" }) {
            var r = validator.validate("SELECT * FROM " + table);
            assertFalse(r.valid(), table + " should not be queryable by the AI");
        }
    }

    @Test
    void stripsCodeFences() {
        String out = validator.stripCodeFences("```sql\nSELECT 1\n```");
        assertEquals("SELECT 1", out);
    }
}
