package com.ai.dashboard.mcp.server;

import com.ai.dashboard.mcp.protocol.McpMessage;
import com.ai.dashboard.mcp.protocol.McpToolDefinition;
import com.ai.dashboard.mcp.tools.McpToolRegistry;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Standard Model Context Protocol (MCP) Server.
 * Exposes SSE transport and JSON-RPC 2.0 message handling for external MCP clients
 * (Claude Desktop, Cursor, AI agents) and internal platform consumers.
 */
@Slf4j
@RestController
@RequestMapping("/mcp")
@RequiredArgsConstructor
@Tag(name = "Model Context Protocol", description = "Standard MCP Server APIs (SSE & JSON-RPC 2.0)")
public class McpServerController {

    private final McpToolRegistry toolRegistry;
    private final ObjectMapper objectMapper;

    private final Map<String, SseEmitter> activeSessions = new ConcurrentHashMap<>();

    /**
     * SSE endpoint to establish an MCP session.
     * Clients (like Claude Desktop) connect here first; the server responds with an
     * 'endpoint' event containing the POST message URI per the official MCP SSE transport spec.
     */
    @GetMapping(value = "/sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Establish an MCP SSE connection session")
    public SseEmitter connectSse() {
        String sessionId = UUID.randomUUID().toString();
        log.info("New MCP client SSE connection established, sessionId={}", sessionId);

        SseEmitter emitter = new SseEmitter(1800_000L); // 30-minute session
        activeSessions.put(sessionId, emitter);

        emitter.onCompletion(() -> {
            log.info("MCP SSE session completed: {}", sessionId);
            activeSessions.remove(sessionId);
        });
        emitter.onTimeout(() -> {
            log.info("MCP SSE session timed out: {}", sessionId);
            activeSessions.remove(sessionId);
        });
        emitter.onError(e -> {
            log.warn("MCP SSE session error for {}: {}", sessionId, e.getMessage());
            activeSessions.remove(sessionId);
        });

        // Send MCP handshake 'endpoint' event per official spec
        try {
            emitter.send(SseEmitter.event()
                    .name("endpoint")
                    .data("/api/mcp/message?sessionId=" + sessionId));
        } catch (Exception e) {
            log.error("Failed to send MCP endpoint handshake: {}", e.getMessage());
        }

        return emitter;
    }

    /**
     * Core JSON-RPC 2.0 endpoint handling standard MCP commands.
     */
    @PostMapping(value = "/message", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Handle JSON-RPC 2.0 MCP messages")
    public McpMessage.McpResponse handleMessage(@RequestBody McpMessage.McpRequest request,
                                               Authentication authentication) {
        if (request == null || request.getMethod() == null) {
            return McpMessage.McpResponse.error(null, -32600, "Invalid Request");
        }

        String method = request.getMethod();
        Object id = request.getId();
        Map<String, Object> params = request.getParams() != null ? request.getParams() : Collections.emptyMap();

        log.info("Received MCP command: method='{}', id={}, user={}",
                method, id, authentication != null ? authentication.getName() : "anonymous");

        try {
            switch (method) {
                case "initialize" -> {
                    Map<String, Object> serverInfo = new LinkedHashMap<>();
                    serverInfo.put("name", "ai-school-mcp-server");
                    serverInfo.put("version", "1.0.0");

                    Map<String, Object> capabilities = new LinkedHashMap<>();
                    capabilities.put("tools", Map.of("listChanged", false));
                    capabilities.put("resources", Map.of("subscribe", false));

                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("protocolVersion", McpMessage.PROTOCOL_VERSION);
                    result.put("capabilities", capabilities);
                    result.put("serverInfo", serverInfo);

                    return McpMessage.McpResponse.success(id, result);
                }

                case "tools/list" -> {
                    List<McpToolDefinition> tools = toolRegistry.getAuthorizedToolDefinitions(authentication);
                    return McpMessage.McpResponse.success(id, Map.of("tools", tools));
                }

                case "tools/call" -> {
                    String toolName = (String) params.get("name");
                    @SuppressWarnings("unchecked")
                    Map<String, Object> arguments = (Map<String, Object>) params.getOrDefault("arguments", Collections.emptyMap());

                    if (toolName == null || toolName.isBlank()) {
                        return McpMessage.McpResponse.error(id, -32602, "Tool name is required");
                    }

                    Map<String, Object> output = toolRegistry.executeTool(toolName, arguments, authentication);

                    // Conform to MCP CallToolResult schema: { content: [ { type: "text", text: "..." } ] }
                    String jsonText = objectMapper.writeValueAsString(output);
                    Map<String, Object> contentItem = Map.of("type", "text", "text", jsonText);
                    return McpMessage.McpResponse.success(id, Map.of("content", List.of(contentItem), "isError", output.containsKey("error")));
                }

                case "ping" -> {
                    return McpMessage.McpResponse.success(id, Map.of());
                }

                default -> {
                    log.warn("Unsupported MCP method called: {}", method);
                    return McpMessage.McpResponse.error(id, -32601, "Method not found: " + method);
                }
            }
        } catch (Exception e) {
            log.error("Error processing MCP message {}: {}", method, e.getMessage(), e);
            return McpMessage.McpResponse.error(id, -32603, "Internal error: " + e.getMessage());
        }
    }
}
