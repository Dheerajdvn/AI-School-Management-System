package com.ai.dashboard.mcp.tools.impl;

import com.ai.dashboard.entity.Student;
import com.ai.dashboard.mcp.tools.McpTool;
import com.ai.dashboard.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * MCP Tool for institutional student metrics, fee aggregations, and course enrollments.
 * Security & Guardrails: Restricted to Teachers and Administrators (RBAC).
 * Completely safe parameterized queries — eliminates SQL injection.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StudentAnalyticsMcpTool implements McpTool {

    private final StudentRepository studentRepository;

    private static final Set<String> ALLOWED_ROLES = Set.of(
            "ROLE_TEACHER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_SCHOOL_ADMIN", "ROLE_PRINCIPAL"
    );

    @Override
    public String getName() {
        return "get_student_analytics";
    }

    @Override
    public String getDescription() {
        return "Calculates student aggregates, fee statistics, and course counts. Restricted to teachers and administrators.";
    }

    @Override
    public Map<String, Object> getInputSchema() {
        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "object");

        Map<String, Object> properties = new LinkedHashMap<>();

        Map<String, Object> metricProp = new LinkedHashMap<>();
        metricProp.put("type", "string");
        metricProp.put("enum", List.of("fee_summary", "course_counts", "total_students", "city_distribution"));
        metricProp.put("description", "Type of analytical metric to calculate");
        properties.put("metricType", metricProp);

        Map<String, Object> courseProp = new LinkedHashMap<>();
        courseProp.put("type", "string");
        courseProp.put("description", "Optional course filter (e.g. 'Java', 'Python')");
        properties.put("course", courseProp);

        schema.put("properties", properties);
        schema.put("required", List.of("metricType"));
        return schema;
    }

    @Override
    public boolean isAuthorized(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        for (GrantedAuthority auth : authentication.getAuthorities()) {
            if (ALLOWED_ROLES.contains(auth.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public Map<String, Object> execute(Map<String, Object> arguments, Authentication authentication) {
        if (!isAuthorized(authentication)) {
            log.warn("Unauthorized attempt to access get_student_analytics by user {}", 
                    authentication != null ? authentication.getName() : "anonymous");
            return Map.of("error", "Access Denied: get_student_analytics is restricted to teachers and administrators.");
        }

        String metricType = (String) arguments.getOrDefault("metricType", "total_students");
        String course = (String) arguments.get("course");

        log.info("MCP get_student_analytics executing: metricType={}, course={}", metricType, course);

        Map<String, Object> result = new LinkedHashMap<>();
        try {
            switch (metricType) {
                case "fee_summary" -> {
                    Double avgFee = studentRepository.averageFees();
                    Double totalFee = studentRepository.totalFees();
                    long count = studentRepository.count();
                    result.put("averageFeeINR", avgFee != null ? Math.round(avgFee * 100.0) / 100.0 : 0.0);
                    result.put("totalFeeINR", totalFee != null ? Math.round(totalFee * 100.0) / 100.0 : 0.0);
                    result.put("studentCount", count);
                }
                case "course_counts" -> {
                    if (course != null && !course.isBlank()) {
                        List<Student> students = studentRepository.findByCourseIgnoreCase(course);
                        result.put("course", course);
                        result.put("count", students.size());
                    } else {
                        List<StudentRepository.LabelValue> rows = studentRepository.countByCourse();
                        Map<String, Long> distribution = new LinkedHashMap<>();
                        for (StudentRepository.LabelValue r : rows) {
                            distribution.put(r.getLabel(), r.getValue());
                        }
                        result.put("courseDistribution", distribution);
                    }
                }
                case "city_distribution" -> {
                    List<StudentRepository.LabelValue> rows = studentRepository.countByCity();
                    Map<String, Long> distribution = new LinkedHashMap<>();
                    for (StudentRepository.LabelValue r : rows) {
                        distribution.put(r.getLabel(), r.getValue());
                    }
                    result.put("cityDistribution", distribution);
                }
                default -> {
                    long total = studentRepository.count();
                    result.put("totalStudents", total);
                }
            }
            return result;
        } catch (Exception e) {
            log.error("MCP get_student_analytics calculation failed: {}", e.getMessage(), e);
            return Map.of("error", "Failed to calculate analytics: " + e.getMessage());
        }
    }
}
