package com.ai.dashboard.validator;

import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.select.Select;
import net.sf.jsqlparser.util.TablesNamesFinder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

/**
 * Validates AI-generated SQL using structured parsing (JSqlParser) before execution.
 * Enforces strict read-only SELECT rules, centralized table whitelisting, and rejection of system schemas and sensitive tables.
 */
@Component
public class SqlValidator {

    /**
     * Tables the NL-to-SQL feature may read.
     *
     * <p>This is deliberately limited to the tables that {@code PromptTemplates.NL2SQL_SYSTEM}
     * actually describes to the model. The {@code student} table is a standalone demo dataset and
     * is not linked to the {@code users} table that holds real accounts, so the AI cannot reach
     * registered users, credentials, or any of the operational school data. Widening this set means
     * widening what a prompt-injected query can read — only add a table here once the system prompt
     * describes it and the data in it is safe for any authenticated caller to aggregate.</p>
     */
    private static final Set<String> ALLOWED_TABLES = Set.of("student");

    private static final Set<String> FORBIDDEN_COLUMNS = Set.of(
            "password", "password_hash", "api_key", "secret", "token", "refresh_token"
    );

    /**
     * Result of a validation pass.
     */
    public record ValidationResult(boolean valid, String reason) {
        public static ValidationResult ok() { return new ValidationResult(true, null); }
        public static ValidationResult fail(String reason) { return new ValidationResult(false, reason); }
    }

    /**
     * Validate the given SQL string for safety and correctness using JSqlParser.
     */
    public ValidationResult validate(String sql) {
        if (sql == null || sql.isBlank()) {
            return ValidationResult.fail("SQL is empty");
        }

        try {
            String lowerSql = sql.toLowerCase();
            for (String forbiddenCol : FORBIDDEN_COLUMNS) {
                if (lowerSql.matches(".*\\b" + forbiddenCol + "\\b.*")) {
                    return ValidationResult.fail("Access to sensitive column '" + forbiddenCol + "' is forbidden");
                }
            }

            Statement statement = CCJSqlParserUtil.parse(sql);

            // Allow ONLY Select statements
            if (!(statement instanceof Select)) {
                return ValidationResult.fail("Only SELECT queries are allowed");
            }

            // Extract table names using JSqlParser TablesNamesFinder
            TablesNamesFinder tablesNamesFinder = new TablesNamesFinder();
            List<String> tableNames = tablesNamesFinder.getTableList(statement);

            if (tableNames == null || tableNames.isEmpty()) {
                return ValidationResult.fail("Query must reference at least one table");
            }

            for (String tableName : tableNames) {
                String cleanName = tableName.replaceAll("[\"`]", "").toLowerCase();
                // Check system schemas / forbidden prefixes
                if (cleanName.startsWith("information_schema") ||
                    cleanName.startsWith("mysql") ||
                    cleanName.startsWith("performance_schema") ||
                    cleanName.startsWith("pg_") ||
                    cleanName.startsWith("sys")) {
                    return ValidationResult.fail("Access to system tables is forbidden");
                }

                // Check table whitelist
                if (!ALLOWED_TABLES.contains(cleanName)) {
                    return ValidationResult.fail("Table not allowed or access restricted: " + tableName);
                }
            }

            return ValidationResult.ok();
        } catch (Exception e) {
            return ValidationResult.fail("Invalid or unsafe SQL structure: " + e.getMessage());
        }
    }

    /**
     * Strip Markdown code fences that the LLM sometimes wraps SQL in.
     */
    public String stripCodeFences(String raw) {
        if (raw == null) return "";
        String s = raw.trim();
        // Remove ```sql ... ``` or ``` ... ```
        if (s.startsWith("```")) {
            int firstNewline = s.indexOf('\n');
            if (firstNewline > 0) {
                s = s.substring(firstNewline + 1);
            }
            int lastFence = s.lastIndexOf("```");
            if (lastFence >= 0) {
                s = s.substring(0, lastFence);
            }
        }
        return s.trim();
    }
}

