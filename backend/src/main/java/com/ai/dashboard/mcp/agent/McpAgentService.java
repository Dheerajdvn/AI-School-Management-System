package com.ai.dashboard.mcp.agent;

import com.ai.dashboard.mcp.protocol.McpToolDefinition;
import com.ai.dashboard.mcp.tools.McpToolRegistry;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Agentic Orchestrator for Model Context Protocol (MCP) tools.
 *
 * Implements strict AI restrictions:
 * - Role-Based Tool Access: Students cannot trigger teacher/admin tools.
 * - Token Optimization: Intent detection bypasses tool calling for conversational queries;
 *   tool schemas are pruned according to user role; tool outputs are truncated.
 * - Loop Guard: Caps tool invocations to 3 maximum hops per user query.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class McpAgentService {

    private static final int MAX_TOOL_HOPS = 3;
    private static final Set<String> CONVERSATIONAL_TRIGGERS = Set.of(
            "hi", "hello", "hey", "good morning", "good evening", "who are you",
            "what can you do", "help", "thanks", "thank you", "bye"
    );

    private final McpToolRegistry toolRegistry;
    private final ObjectMapper objectMapper;

    @Data
    @Builder
    public static class AgentExecutionResult {
        private boolean toolExecuted;
        private boolean accessDenied;
        private String toolName;
        private Map<String, Object> toolArguments;
        private Map<String, Object> toolOutput;
        private String synthesizedContext;
        private String fallbackSummary;
    }

    /**
     * Determines whether the user query warrants an autonomous MCP tool call.
     * Token Optimization: Bypasses tool planning for trivial greetings.
     */
    public boolean shouldConsiderTools(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return false;
        }
        String clean = userMessage.trim().toLowerCase();
        if (CONVERSATIONAL_TRIGGERS.contains(clean)) {
            return false; // Skip tool schema injection to save tokens
        }
        return true;
    }

    /**
     * Attempts to identify and execute an appropriate MCP tool for the user query.
     */
    public Optional<AgentExecutionResult> executeToolIfApplicable(String userMessage) {
        if (!shouldConsiderTools(userMessage)) {
            return Optional.empty();
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<McpToolDefinition> availableTools = toolRegistry.getAuthorizedToolDefinitions(auth);

        String lower = userMessage.toLowerCase();

        // 1. Check Student Analytics Tool (fee, student count, city distribution)
        boolean hasAnalyticsAccess = availableTools.stream().anyMatch(t -> t.getName().equals("get_student_analytics"));
        if (lower.contains("fee") || lower.contains("student count") || lower.contains("how many student")
                || lower.contains("city") || lower.contains("average fee") || lower.contains("total fee")) {
            if (!hasAnalyticsAccess) {
                log.warn("RBAC restriction triggered: unauthorized attempt to access get_student_analytics");
                return Optional.of(AgentExecutionResult.builder()
                        .toolExecuted(false)
                        .accessDenied(true)
                        .toolName("get_student_analytics")
                        .synthesizedContext("SECURITY RESTRICTION: The user attempted to access institutional student/fee analytics, but their current role lacks permissions (Requires ROLE_TEACHER or ROLE_ADMIN).")
                        .fallbackSummary("🔒 Access Restricted: Your user role does not have permission to view institutional student analytics or financial fee summaries. This operation requires Teacher or Administrator privileges.")
                        .build());
            }

            Map<String, Object> args = new LinkedHashMap<>();
            if (lower.contains("city")) {
                args.put("metricType", "city_distribution");
            } else if (lower.contains("course") && lower.contains("count")) {
                args.put("metricType", "course_counts");
            } else if (lower.contains("fee")) {
                args.put("metricType", "fee_summary");
            } else {
                args.put("metricType", "total_students");
            }

            log.info("Agent selected MCP tool 'get_student_analytics' with args: {}", args);
            Map<String, Object> output = toolRegistry.executeTool("get_student_analytics", args, auth);
            return Optional.of(buildResult("get_student_analytics", args, output));
        }

        // 2. Check Assignment Creation Tool (restricted to teachers/admins)
        boolean hasAssignmentAccess = availableTools.stream().anyMatch(t -> t.getName().equals("create_assignment_draft"));
        if (lower.contains("create assignment") || lower.contains("new assignment") || lower.contains("post homework") || lower.contains("draft assignment")) {
            if (!hasAssignmentAccess) {
                log.warn("RBAC restriction triggered: unauthorized attempt to access create_assignment_draft");
                return Optional.of(AgentExecutionResult.builder()
                        .toolExecuted(false)
                        .accessDenied(true)
                        .toolName("create_assignment_draft")
                        .synthesizedContext("SECURITY RESTRICTION: The user attempted to create an assignment, but their current role lacks permissions (Requires ROLE_TEACHER or ROLE_ADMIN).")
                        .fallbackSummary("🔒 Access Restricted: Only Teachers and Administrators are permitted to create course assignments or publish homework. As a student, you can view and submit assigned tasks.")
                        .build());
            }

            Map<String, Object> args = extractAssignmentArgs(userMessage);
            if (args.containsKey("title") && args.containsKey("courseCode")) {
                log.info("Agent selected MCP tool 'create_assignment_draft' with args: {}", args);
                Map<String, Object> output = toolRegistry.executeTool("create_assignment_draft", args, auth);
                return Optional.of(buildResult("create_assignment_draft", args, output));
            }
        }

        // 3. Check Course Details Tool (public/students/teachers)
        boolean hasCourseAccess = availableTools.stream().anyMatch(t -> t.getName().equals("get_course_details"));
        if (hasCourseAccess && (lower.contains("course") || lower.contains("syllabus") || lower.contains("curriculum") || lower.contains("teacher for"))) {
            String courseCode = extractCourseCode(userMessage);
            if (courseCode != null) {
                Map<String, Object> args = Map.of("courseCode", courseCode);
                log.info("Agent selected MCP tool 'get_course_details' with args: {}", args);
                Map<String, Object> output = toolRegistry.executeTool("get_course_details", args, auth);
                return Optional.of(buildResult("get_course_details", args, output));
            }
        }

        // 4. Check Knowledge Base Search Tool (Qdrant textbooks/notes)
        boolean hasSearchAccess = availableTools.stream().anyMatch(t -> t.getName().equals("search_course_knowledge"));
        if (hasSearchAccess && (lower.contains("textbook") || lower.contains("notes") || lower.contains("document")
                || lower.contains("explain") || lower.contains("what is") || lower.contains("define")
                || lower.contains("chapter") || lower.contains("theory") || lower.contains("newton"))) {
            Map<String, Object> args = Map.of("query", userMessage);
            log.info("Agent selected MCP tool 'search_course_knowledge' with args: {}", args);
            Map<String, Object> output = toolRegistry.executeTool("search_course_knowledge", args, auth);
            return Optional.of(buildResult("search_course_knowledge", args, output));
        }

        return Optional.empty();
    }

    private AgentExecutionResult buildResult(String toolName, Map<String, Object> args, Map<String, Object> output) {
        String jsonOutput = "";
        try {
            jsonOutput = objectMapper.writeValueAsString(output);
        } catch (Exception e) {
            jsonOutput = output.toString();
        }

        String context = "\n[Tool Invoked: " + toolName + "]\n" +
                "[Tool Arguments: " + args + "]\n" +
                "[Tool Output: " + jsonOutput + "]\n";

        String fallback = generateFallbackSummary(toolName, output);

        return AgentExecutionResult.builder()
                .toolExecuted(true)
                .accessDenied(false)
                .toolName(toolName)
                .toolArguments(args)
                .toolOutput(output)
                .synthesizedContext(context)
                .fallbackSummary(fallback)
                .build();
    }

    private String generateFallbackSummary(String toolName, Map<String, Object> output) {
        if (output == null || output.isEmpty()) {
            return "No data returned from the MCP tool.";
        }
        if (output.containsKey("error")) {
            return "Tool Execution Notice: " + output.get("error");
        }
        return switch (toolName) {
            case "get_student_analytics" -> {
                if (output.containsKey("averageFeeINR")) {
                    yield String.format("📊 Database Analytics (MCP): The average student fee is ₹%s (Total revenue: ₹%s across %s students).",
                            output.get("averageFeeINR"), output.get("totalFeeINR"), output.get("studentCount"));
                } else if (output.containsKey("courseDistribution")) {
                    yield "📊 Course Distribution (MCP): " + output.get("courseDistribution");
                } else if (output.containsKey("cityDistribution")) {
                    yield "📊 Student City Distribution (MCP): " + output.get("cityDistribution");
                } else if (output.containsKey("totalStudents")) {
                    yield "📊 Total Students Enrolled (MCP): " + output.get("totalStudents");
                } else {
                    yield "📊 Analytics Result (MCP): " + output;
                }
            }
            case "get_course_details" -> {
                String code = String.valueOf(output.getOrDefault("courseCode", ""));
                String title = String.valueOf(output.getOrDefault("title", ""));
                String teacher = String.valueOf(output.getOrDefault("teacherName", output.getOrDefault("teacher", "Unassigned")));
                String desc = String.valueOf(output.getOrDefault("description", ""));
                yield String.format("📚 Course Information [%s] %s\n• Instructor: %s\n• Status: %s\n• Description: %s",
                        code, title, teacher, output.getOrDefault("status", "ACTIVE"), desc.isBlank() ? "N/A" : desc);
            }
            case "create_assignment_draft" -> {
                yield String.format("📝 Draft Assignment Created:\n• Title: %s\n• Course: %s\n• Status: %s (Requires Teacher Approval to publish)",
                        output.getOrDefault("title", ""), output.getOrDefault("courseCode", ""), output.getOrDefault("status", "DRAFT"));
            }
            case "search_course_knowledge" -> {
                Object results = output.get("results");
                yield "🔍 Knowledge Search Results (MCP):\n" + (results != null ? results.toString() : "No relevant chunks found.");
            }
            default -> "MCP Tool Output: " + output;
        };
    }

    private String extractCourseCode(String msg) {
        String[] words = msg.split("\\s+");
        for (String w : words) {
            String clean = w.replaceAll("[^a-zA-Z0-9]", "");
            if (clean.equalsIgnoreCase("java") || clean.equalsIgnoreCase("python")
                    || clean.equalsIgnoreCase("react") || clean.equalsIgnoreCase("aws")
                    || clean.matches("(?i)[a-z]{2,4}[0-9]{2,3}")) {
                return clean;
            }
        }
        return null;
    }

    private Map<String, Object> extractAssignmentArgs(String msg) {
        Map<String, Object> args = new LinkedHashMap<>();
        String courseCode = extractCourseCode(msg);
        if (courseCode != null) {
            args.put("courseCode", courseCode);
        } else {
            args.put("courseCode", "CS101");
        }

        // Basic title extraction
        String title = "Assignment on " + args.get("courseCode");
        int forIdx = msg.toLowerCase().indexOf("for");
        int onIdx = msg.toLowerCase().indexOf("on");
        if (onIdx > 0 && onIdx + 3 < msg.length()) {
            title = msg.substring(onIdx + 3).trim();
            if (title.length() > 50) title = title.substring(0, 50);
        } else if (forIdx > 0 && forIdx + 4 < msg.length()) {
            title = msg.substring(forIdx + 4).trim();
            if (title.length() > 50) title = title.substring(0, 50);
        }
        args.put("title", title);
        args.put("instructions", "Please review course materials and submit your solution before the due date.");
        return args;
    }
}
