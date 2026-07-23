package com.ai.dashboard.service.impl;

import com.ai.dashboard.ai.SqlExecutor;
import com.ai.dashboard.ai.model.LLMProvider;
import com.ai.dashboard.ai.prompt.PromptBuildRequest;
import com.ai.dashboard.ai.prompt.PromptBuilder;
import com.ai.dashboard.ai.prompt.PromptMessage;
import com.ai.dashboard.ai.prompt.PromptType;
import com.ai.dashboard.ai.prompt.SqlPromptTemplate;
import com.ai.dashboard.dto.AiQueryRequest;
import com.ai.dashboard.dto.AiQueryResponse;
import com.ai.dashboard.exception.AiServiceException;
import com.ai.dashboard.exception.UnsafeSqlException;
import com.ai.dashboard.exception.AccessDeniedException;
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
import java.util.Map;

/**
 * Orchestrates the natural-language → SQL → validate → execute → summarise pipeline.
 *
 * <p>Single Responsibility: this class only coordinates. Prompt assembly lives in
 * {@link PromptBuilder}, SQL safety in {@link SqlValidator}, execution in
 * {@link SqlExecutor}, and model access behind {@link LLMProvider}.</p>
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
        return llmProvider.isAvailable();
    }

    // ------------------------------------------------------------------

    private void verifyUserAuthorization() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AccessDeniedException("User must be authenticated to execute AI queries.");
        }
    }

    private String generateRaw(String question) {
        try {
            PromptMessage prompt = promptBuilder.build(PromptBuildRequest.builder(PromptType.SQL_GENERATOR)
                    .variables(Map.of("question", question))
                    .build());
            return llmProvider.generate(prompt.systemPrompt(), prompt.userPrompt());
        } catch (Exception e) {
            log.error("LLM call failed safely: {}", e.getMessage());
            throw new AiServiceException("Failed to generate response from AI model.");
        }
    }

    private String summarise(String question, List<Map<String, Object>> rows) {
        if (rows.isEmpty()) {
            return "No matching records found.";
        }
        try {
            String preview = objectMapper.writeValueAsString(rows.subList(0, Math.min(5, rows.size())));
            String prompt = sqlPromptTemplate.buildSummaryPrompt(question, preview)
                    .formatted(rows.size());
            return llmProvider.generate(
                    "You summarise database query results in one concise sentence.",
                    prompt);
        } catch (Exception e) {
            log.debug("Summarisation skipped: {}", e.getMessage());
            return rows.size() + " row(s) returned.";
        }
    }

    private String rootMessage(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null && cur.getCause() != cur) cur = cur.getCause();
        return cur.getMessage();
    }
}
