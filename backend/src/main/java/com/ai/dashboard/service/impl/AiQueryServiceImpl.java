package com.ai.dashboard.service.impl;

import com.ai.dashboard.ai.SqlExecutor;
import com.ai.dashboard.ai.model.LLMProvider;
import com.ai.dashboard.ai.prompt.PromptBuildRequest;
import com.ai.dashboard.ai.prompt.PromptBuilder;
import com.ai.dashboard.ai.prompt.PromptMessage;
import com.ai.dashboard.ai.prompt.PromptType;
import com.ai.dashboard.ai.prompt.SqlPromptTemplate;
import com.ai.dashboard.ai.provider.LlmProviderStrategy;
import com.ai.dashboard.ai.provider.ProviderRegistry;
import com.ai.dashboard.dto.AiQueryRequest;
import com.ai.dashboard.dto.AiQueryResponse;
import com.ai.dashboard.entity.UserAiConfig;
import com.ai.dashboard.exception.AiServiceException;
import com.ai.dashboard.exception.UnsafeSqlException;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.repository.UserAiConfigRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.service.AiQueryService;
import com.ai.dashboard.util.ChartTypeInferrer;
import com.ai.dashboard.validator.SqlValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Orchestrates the natural-language → SQL → validate → execute → summarise pipeline.
 *
 * <p>Supports user-configured cloud LLM providers (e.g. Google Gemini, OpenAI, Claude),
 * local Ollama execution, and offline heuristic fallbacks for common queries.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiQueryServiceImpl implements AiQueryService {

    private final LLMProvider llmProvider;
    private final PromptBuilder promptBuilder;
    private final SqlPromptTemplate sqlPromptTemplate;
    private final SqlValidator sqlValidator;
    private final SqlExecutor sqlExecutor;
    private final ObjectMapper objectMapper;
    private final UserAiConfigRepository configRepository;
    private final UserRepository userRepository;
    private final ProviderRegistry providerRegistry;

    private record GenerationContext(LlmProviderStrategy strategy, UserAiConfig config) {}

    private GenerationContext resolveGenerationContext() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            String username = auth.getName();
            var configOpt = configRepository.findByUserUsernameOrUserEmail(username, username);
            if (configOpt.isEmpty()) {
                var userOpt = userRepository.findByUsername(username)
                        .or(() -> userRepository.findByEmail(username));
                if (userOpt.isPresent()) {
                    configOpt = configRepository.findByUserId(userOpt.get().getId());
                }
            }
            if (configOpt.isPresent()) {
                UserAiConfig config = configOpt.get();
                String providerName = config.getProvider();
                if (providerName != null && !providerName.equalsIgnoreCase("Ollama")) {
                    try {
                        LlmProviderStrategy strategy = providerRegistry.get(providerName);
                        return new GenerationContext(strategy, config);
                    } catch (Exception e) {
                        log.warn("Failed to resolve strategy for provider {}: {}", providerName, e.getMessage());
                    }
                }
            }
        }
        return null;
    }

    @Override
    public AiQueryResponse ask(AiQueryRequest request) {
        verifyUserAuthorization();

        final String question = request.getQuestion().trim();
        log.info("AI ask: {}", question);

        String raw = generateRaw(question);
        String sql = sqlValidator.stripCodeFences(raw);
        var validation = sqlValidator.validate(sql);
        if (!validation.valid()) {
            log.warn("AI SQL rejected: {} | sql={}", validation.reason(), sql);
            throw new UnsafeSqlException("AI produced unsafe SQL: " + validation.reason());
        }

        SqlExecutor.QueryResult result;
        try {
            result = sqlExecutor.execute(sql);
        } catch (Exception e) {
            log.error("SQL execution failed safely: {}", e.getMessage());
            throw new AiServiceException("Query execution failed due to invalid data constraints.");
        }

        String chartType = ChartTypeInferrer.infer(result.rows());
        String summary = summarise(question, result.rows());

        return AiQueryResponse.builder()
                .question(question)
                .sql(sql)
                .summary(summary)
                .rows(result.rows())
                .rowCount(result.rows().size())
                .chartType(chartType)
                .warning(result.rows().size() >= 200 ? "Result truncated to 200 rows" : null)
                .build();
    }

    @Override
    public String generateSqlOnly(String question) {
        verifyUserAuthorization();

        String raw = generateRaw(question);
        String sql = sqlValidator.stripCodeFences(raw);
        var validation = sqlValidator.validate(sql);
        if (!validation.valid()) {
            throw new UnsafeSqlException("AI produced unsafe SQL: " + validation.reason());
        }
        return sql;
    }

    @Override
    public boolean isLlmAvailable() {
        if (resolveGenerationContext() != null) {
            return true;
        }
        return llmProvider.isAvailable();
    }

    private void verifyUserAuthorization() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AccessDeniedException("User must be authenticated to execute AI queries.");
        }
    }

    private String generateRaw(String question) {
        GenerationContext ctx = resolveGenerationContext();
        if (ctx != null) {
            UserAiConfig cfg = ctx.config();
            try {
                PromptMessage prompt = promptBuilder.build(PromptBuildRequest.builder(PromptType.SQL_GENERATOR)
                        .variables(Map.of("question", question))
                        .build());
                String sqlResponse = ctx.strategy().generate(
                        cfg.getApiKey(),
                        cfg.getBaseUrl(),
                        cfg.getModel(),
                        cfg.getTemperature() != null ? cfg.getTemperature() : 0.2,
                        cfg.getMaxTokens() != null ? cfg.getMaxTokens() : 1000,
                        prompt.systemPrompt(),
                        prompt.userPrompt()
                );
                if (sqlResponse != null && !sqlResponse.isBlank()) {
                    return sqlResponse;
                }
            } catch (Exception e) {
                log.warn("Custom AI provider {} failed for SQL generation: {}", cfg.getProvider(), e.getMessage());
            }
        }

        if (llmProvider.isAvailable()) {
            try {
                PromptMessage prompt = promptBuilder.build(PromptBuildRequest.builder(PromptType.SQL_GENERATOR)
                        .variables(Map.of("question", question))
                        .build());
                return llmProvider.generate(prompt.systemPrompt(), prompt.userPrompt());
            } catch (Exception e) {
                log.warn("Local Ollama call failed: {}", e.getMessage());
            }
        }

        // Heuristic fallback for common queries and suggestions
        String heuristicSql = matchHeuristicSql(question);
        if (heuristicSql != null) {
            log.info("Answered query using offline intelligent heuristic pattern: {}", question);
            return heuristicSql;
        }

        throw new AiServiceException("AI engine offline: Local Ollama is not running at http://localhost:11434. Please start Ollama or configure a cloud AI key (e.g. Google Gemini, OpenAI) in Settings.");
    }

    private String matchHeuristicSql(String question) {
        if (question == null) return null;
        String q = question.trim().toLowerCase(Locale.ROOT);
        if (q.contains("top") && q.contains("course")) {
            return "```sql\nSELECT course, COUNT(*) AS student_count FROM student GROUP BY course ORDER BY student_count DESC LIMIT 5;\n```";
        }
        if (q.contains("java") && (q.contains("student") || q.contains("show") || q.contains("all"))) {
            return "```sql\nSELECT * FROM student WHERE LOWER(course) LIKE '%java%' OR LOWER(subject) LIKE '%java%' LIMIT 100;\n```";
        }
        if (q.contains("average") && q.contains("fee")) {
            return "```sql\nSELECT ROUND(AVG(fee)::numeric, 2) AS average_fee FROM student;\n```";
        }
        if ((q.contains("highest") || q.contains("max")) && q.contains("fee")) {
            return "```sql\nSELECT * FROM student ORDER BY fee DESC LIMIT 1;\n```";
        }
        if (q.contains("hyderabad")) {
            return "```sql\nSELECT * FROM student WHERE LOWER(address) LIKE '%hyderabad%' LIMIT 100;\n```";
        }
        if (q.contains("january 2024") || (q.contains("january") && q.contains("2024"))) {
            return "```sql\nSELECT * FROM student WHERE EXTRACT(YEAR FROM joining_date) = 2024 AND EXTRACT(MONTH FROM joining_date) = 1 LIMIT 100;\n```";
        }
        if (q.contains("city") && (q.contains("student") || q.contains("total") || q.contains("per"))) {
            return "```sql\nSELECT address AS city, COUNT(*) AS student_count FROM student GROUP BY address ORDER BY student_count DESC LIMIT 100;\n```";
        }
        if (q.contains("subject") && (q.contains("count") || q.contains("student"))) {
            return "```sql\nSELECT subject, COUNT(*) AS student_count FROM student GROUP BY subject ORDER BY student_count DESC;\n```";
        }
        if (q.contains("30000") || (q.contains("paid") && q.contains("more"))) {
            return "```sql\nSELECT * FROM student WHERE fee > 30000 LIMIT 100;\n```";
        }
        if (q.contains("youngest") || (q.contains("joiners") && q.contains("year"))) {
            return "```sql\nSELECT * FROM student ORDER BY joining_date DESC LIMIT 5;\n```";
        }
        if (q.contains("total student") || q.contains("count student") || q.contains("how many student")) {
            return "```sql\nSELECT COUNT(*) AS total_students FROM student;\n```";
        }
        if (q.contains("all student") || q.contains("list student")) {
            return "```sql\nSELECT * FROM student LIMIT 100;\n```";
        }
        return null;
    }

    private String summarise(String question, List<Map<String, Object>> rows) {
        if (rows.isEmpty()) {
            return "No matching records found.";
        }
        GenerationContext ctx = resolveGenerationContext();
        if (ctx != null) {
            UserAiConfig cfg = ctx.config();
            try {
                String preview = objectMapper.writeValueAsString(rows.subList(0, Math.min(5, rows.size())));
                String prompt = sqlPromptTemplate.buildSummaryPrompt(question, preview).formatted(rows.size());
                return ctx.strategy().generate(
                        cfg.getApiKey(),
                        cfg.getBaseUrl(),
                        cfg.getModel(),
                        0.3,
                        150,
                        "You summarise database query results in one concise sentence.",
                        prompt
                );
            } catch (Exception e) {
                log.debug("Summarisation via custom provider failed: {}", e.getMessage());
            }
        }

        if (llmProvider.isAvailable()) {
            try {
                String preview = objectMapper.writeValueAsString(rows.subList(0, Math.min(5, rows.size())));
                String prompt = sqlPromptTemplate.buildSummaryPrompt(question, preview)
                        .formatted(rows.size());
                return llmProvider.generate(
                        "You summarise database query results in one concise sentence.",
                        prompt);
            } catch (Exception e) {
                log.debug("Summarisation skipped: {}", e.getMessage());
            }
        }

        return "Successfully retrieved " + rows.size() + " record(s) matching your request.";
    }
}
