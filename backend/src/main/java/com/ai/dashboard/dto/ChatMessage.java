package com.ai.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A single message in the conversational AI chat.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    /** "user" or "assistant" */
    private String role;

    private String content;

    /** Optional structured payload when the assistant returns data */
    private AiQueryResponse data;
}
