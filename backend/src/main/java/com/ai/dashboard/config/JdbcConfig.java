package com.ai.dashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import javax.sql.DataSource;

/**
 * Exposes {@link JdbcTemplate} and {@link NamedParameterJdbcTemplate} beans.
 *
 * <p>Used by the AI module to execute validated LLM-generated SQL outside the
 * JPA / entity layer.</p>
 */
@Configuration
public class JdbcConfig {

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        JdbcTemplate t = new JdbcTemplate(dataSource);
        t.setFetchSize(200);
        t.setMaxRows(500);
        return t;
    }

    @Bean
    public NamedParameterJdbcTemplate namedParameterJdbcTemplate(DataSource dataSource) {
        return new NamedParameterJdbcTemplate(dataSource);
    }
}
