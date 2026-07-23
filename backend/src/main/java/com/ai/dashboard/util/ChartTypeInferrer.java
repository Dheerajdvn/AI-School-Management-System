package com.ai.dashboard.util;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Heuristic that decides which chart type best represents an AI result set.
 *
 * <p>This class has a <strong>single responsibility</strong>: recommending a
 * chart type based on the shape and content of query result rows. It does
 * <em>not</em> build prompts, execute SQL, or format data.</p>
 *
 * <p>Rules of thumb:</p>
 * <ul>
 *   <li>Single column, single row → {@code metric}</li>
 *   <li>Two columns with month/date in first column → {@code line}</li>
 *   <li>Two columns with city/location in first column → {@code pie}</li>
 *   <li>Two columns with a numeric second column → {@code bar}</li>
 *   <li>More than two columns → {@code table}</li>
 *   <li>No data → {@code table}</li>
 * </ul>
 */
public final class ChartTypeInferrer {

    /** Column name fragments that suggest a date/time dimension. */
    private static final Set<String> DATE_HINTS = new HashSet<>(Set.of(
            "month", "year", "date", "day", "joining", "created", "updated",
            "time", "quarter", "weekly", "monthly", "yearly"));

    /** Column name fragments that suggest a geographic dimension. */
    private static final Set<String> CITY_HINTS = new HashSet<>(Set.of(
            "city", "address", "location", "state", "country", "district",
            "region", "zone", "area", "place"));

    private ChartTypeInferrer() {}

    /**
     * Recommend a chart type based on the shape and content of the result rows.
     *
     * @param rows the query result rows
     * @return one of {@code metric}, {@code bar}, {@code pie}, {@code line}, or {@code table}
     */
    public static String infer(List<Map<String, Object>> rows) {
        if (rows == null || rows.isEmpty()) {
            return AppConstants.CHART_TABLE;
        }

        Map<String, Object> firstRow = rows.get(0);
        int cols = firstRow.size();

        // Single column → metric (single value) or table (multiple values)
        if (cols == 1) {
            if (rows.size() == 1) {
                return AppConstants.CHART_METRIC;
            }
            return AppConstants.CHART_TABLE;
        }

        // Two columns → bar, pie, or line
        if (cols == 2) {
            List<String> keys = firstRow.keySet().stream().toList();
            String firstCol = keys.get(0).toLowerCase();
            String secondCol = keys.get(1).toLowerCase();

            // Check if first column looks like a date
            if (containsDateHint(firstCol)) {
                return AppConstants.CHART_LINE;
            }

            // Check if first column looks like a city/location
            if (containsCityHint(firstCol)) {
                return AppConstants.CHART_PIE;
            }

            // Check if first column values look like dates
            Object firstVal = firstRow.get(keys.get(0));
            if (firstVal instanceof String && ((String) firstVal).matches("\\d{4}[-/]\\d{2}")) {
                return AppConstants.CHART_LINE;
            }

            // Default for two numeric columns: bar
            Object secondVal = firstRow.get(keys.get(1));
            if (secondVal instanceof Number) {
                return AppConstants.CHART_BAR;
            }

            // Fallback
            return AppConstants.CHART_BAR;
        }

        return AppConstants.CHART_TABLE;
    }

    private static boolean containsDateHint(String column) {
        return DATE_HINTS.stream().anyMatch(hint -> column.contains(hint));
    }

    private static boolean containsCityHint(String column) {
        return CITY_HINTS.stream().anyMatch(hint -> column.contains(hint));
    }
}