package com.ai.dashboard.mcp.protocol;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Standard JSON-RPC 2.0 messages conforming to the Model Context Protocol (MCP) specification.
 * Protocol version: 2024-11-05
 */
public class McpMessage {

    public static final String JSONRPC_VERSION = "2.0";
    public static final String PROTOCOL_VERSION = "2024-11-05";

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class McpRequest {
        @Builder.Default
        private String jsonrpc = JSONRPC_VERSION;
        private Object id;
        private String method;
        private Map<String, Object> params;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class McpResponse {
        @Builder.Default
        private String jsonrpc = JSONRPC_VERSION;
        private Object id;
        private Object result;
        private McpError error;

        public static McpResponse success(Object id, Object result) {
            return McpResponse.builder()
                    .jsonrpc(JSONRPC_VERSION)
                    .id(id)
                    .result(result)
                    .build();
        }

        public static McpResponse error(Object id, int code, String message) {
            return McpResponse.builder()
                    .jsonrpc(JSONRPC_VERSION)
                    .id(id)
                    .error(new McpError(code, message, null))
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class McpError {
        private int code;
        private String message;
        private Object data;
    }
}
