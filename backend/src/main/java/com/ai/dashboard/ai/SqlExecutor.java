package com.ai.dashboard.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Executes validated, read-only SQL and converts the JDBC result set into a
 * list of plain maps (column name -> value).
 *
 * <p>Keeps the data-access concern out of the orchestration service.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SqlExecutor {

    private static final int MAX_ROWS = 200;

    private final JdbcTemplate jdbcTemplate;

    /**
     * Run a validated SELECT query and return rows as maps.
     */
    public QueryResult execute(String sql) {
        return jdbcTemplate.query(con -> {
            var ps = con.prepareStatement(sql,
                    ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            ps.setQueryTimeout(5);
            ps.setFetchSize(MAX_ROWS);
            ps.setMaxRows(MAX_ROWS);
            return ps;
        }, rs -> {
            List<Map<String, Object>> rows = new ArrayList<>();
            ResultSetMetaData meta = rs.getMetaData();
            int columnCount = meta.getColumnCount();
            List<String> columnNames = new ArrayList<>(columnCount);
            for (int i = 1; i <= columnCount; i++) {
                columnNames.add(meta.getColumnLabel(i));
            }
            while (rs.next()) {
                Map<String, Object> row = new LinkedHashMap<>();
                for (int i = 0; i < columnCount; i++) {
                    row.put(columnNames.get(i), rs.getObject(i + 1));
                }
                rows.add(row);
            }
            return new QueryResult(columnNames, rows);
        });
    }

    /**
     * Tuple of column names and materialised rows.
     */
    public record QueryResult(List<String> columns, List<Map<String, Object>> rows) {}
}
