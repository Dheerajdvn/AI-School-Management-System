package com.ai.dashboard.mcp.tools;

import org.springframework.security.core.Authentication;

import java.util.Map;

/**
 * Contract for all educational Model Context Protocol (MCP) tools.
 * Includes built-in RBAC authorization checks and argument execution.
 */
public interface McpTool {

    /**
     * Unique machine-readable tool name (e.g. "search_course_knowledge").
     */
    String getName();

    /**
     * Human- and LLM-readable description explaining what the tool does and when to call it.
     */
    String getDescription();

    /**
     * JSON Schema specification of tool arguments.
     */
    Map<String, Object> getInputSchema();

    /**
     * Evaluates whether the caller has the necessary role/permissions to invoke this tool.
     */
    boolean isAuthorized(Authentication authentication);

    /**
     * Executes the tool with the given arguments within the caller's security context.
     *
     * @param arguments input arguments matching inputSchema
     * @param authentication active Spring Security authentication
     * @return structured output map
     */
    Map<String, Object> execute(Map<String, Object> arguments, Authentication authentication);
}
