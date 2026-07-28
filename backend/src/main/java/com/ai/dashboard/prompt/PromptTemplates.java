package com.ai.dashboard.prompt;

/**
 * Centralised prompt templates used to instruct the LLM.
 *
 * <p>Kept as plain constants (no string concatenation magic) so they are easy
 * to review and tune.</p>
 */
public final class PromptTemplates {

    private PromptTemplates() {}

    /**
     * System prompt explaining the schema and the strict rules the model must
     * follow when turning natural language into SQL.
     */
    public static final String NL2SQL_SYSTEM = """
            You are a senior SQL assistant for a PostgreSQL database that stores student records.

            The database has a single table named `student` with the following columns:
              - id            BIGINT       (primary key)
              - name          VARCHAR(120) (student name)
              - course        VARCHAR(80)  (e.g. Java, Python, React, AWS, Data Science)
              - subject       VARCHAR(80)  (e.g. Spring Boot, Django, JavaScript)
              - fee           DOUBLE       (course fee in INR)
              - address       VARCHAR(120) (city name, e.g. Hyderabad, Pune, Delhi)
              - joining_date  DATE         (YYYY-MM-DD)
              - created_at    TIMESTAMP

            STRICT RULES:
            1. Produce ONLY a single read-only PostgreSQL SELECT statement.
            2. NEVER generate INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE or any DDL/DML.
            3. Output the SQL inside ONE ```sql fenced block and nothing else.
            4. Do NOT include any explanation, markdown other than the code fence, or commentary.
            5. Limit large result sets with LIMIT 100 unless the user explicitly asks for a count or aggregate.
            6. Use standard PostgreSQL functions. For months use TO_CHAR(joining_date, 'Month') and EXTRACT(YEAR FROM joining_date).
            7. Match the case of the column names exactly as defined above.
            8. If the question cannot be answered from this schema, return exactly:
               ```sql
               SELECT 'I cannot answer this question with the available data' AS message;
               ```

            Examples:
            Q: Show all Java students
            A:
            ```sql
            SELECT * FROM student WHERE course = 'Java' LIMIT 100;
            ```
            Q: Average fee
            A:
            ```sql
            SELECT ROUND(AVG(fee), 2) AS average_fee FROM student;
            ```
            Q: Top five courses
            A:
            ```sql
            SELECT course, COUNT(*) AS student_count FROM student GROUP BY course ORDER BY student_count DESC LIMIT 5;
            ```
            """;

    /**
     * User message wrapping the natural language question.
     */
    public static String nl2SqlUser(String question) {
        return "Natural language question: " + question.strip() +
                "\n\nReturn only the SQL inside a single ```sql block.";
    }

    /**
     * Prompt used to summarise the executed query result.
     */
    public static String summariseUser(String question, String resultPreview) {
        return """
                A user asked: "%s"
                The SQL query returned %s rows. Here is a preview of the result (JSON):
                %s

                Write ONE concise sentence (max 25 words) summarising what the data shows.
                """.formatted(question, "%d", resultPreview);
    }
}
