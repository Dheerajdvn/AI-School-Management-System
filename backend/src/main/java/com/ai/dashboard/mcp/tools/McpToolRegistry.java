package com.ai.dashboard.mcp.tools;

import com.ai.dashboard.mcp.protocol.McpToolDefinition;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Registry of all available Model Context Protocol (MCP) tools.
 * Provides role-based tool pruning (saving tokens and enforcing security).
 */
@Slf4j
@Component
public class McpToolRegistry {

    private final Map<String, McpTool> toolMap = new LinkedHashMap<>();

    public McpToolRegistry(List<McpTool> tools) {
        for (McpTool tool : tools) {
            toolMap.put(tool.getName(), tool);
            log.info("Registered MCP Tool: '{}' ({})", tool.getName(), tool.getDescription());
        }
    }

    /**
     * Look up a tool by its unique name.
     */
    public Optional<McpTool> getTool(String name) {
        return Optional.ofNullable(toolMap.get(name));
    }

    /**
     * Returns all registered tools.
     */
    public List<McpTool> getAllTools() {
        return List.copyOf(toolMap.values());
    }

    /**
     * Returns only the tools that the active user has permissions to see and invoke.
     * Token Optimization: Omits unauthorized tools from prompt context.
     */
    public List<McpToolDefinition> getAuthorizedToolDefinitions(Authentication authentication) {
        List<McpToolDefinition> definitions = new ArrayList<>();
        for (McpTool tool : toolMap.values()) {
            if (tool.isAuthorized(authentication)) {
                definitions.add(McpToolDefinition.builder()
                        .name(tool.getName())
                        .description(tool.getDescription())
                        .inputSchema(tool.getInputSchema())
                        .build());
            }
        }
        return definitions;
    }

    /**
     * Dispatches execution of a named tool within caller's authentication context.
     */
    public Map<String, Object> executeTool(String toolName, Map<String, Object> arguments, Authentication authentication) {
        McpTool tool = toolMap.get(toolName);
        if (tool == null) {
            return Map.of("error", "Unknown MCP tool: " + toolName);
        }
        if (!tool.isAuthorized(authentication)) {
            return Map.of("error", "Unauthorized: User lacks required role for tool: " + toolName);
        }
        return tool.execute(arguments != null ? arguments : Collections.emptyMap(), authentication);
    }
}
