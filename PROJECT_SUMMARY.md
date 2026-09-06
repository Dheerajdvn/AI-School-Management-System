# 📄 Project Technical Summary

Enterprise-grade, AI-powered School Management System combining academic administration with multi-provider LLM orchestration, Retrieval-Augmented Generation (RAG), and a native Model Context Protocol (MCP) server.

---

## 1. Technical Stack Overview

- **Backend**: Spring Boot 3.5 on **Java 17**, Spring Data JPA, Spring Security 6.
- **Frontend**: React 18, Vite 5, React Router 6, Bootstrap 5, custom CSS design system.
- **AI & RAG**: LangChain4j 0.34.0, Qdrant Cloud (`nomic-embed-text`, 768-dim), multi-provider strategy layer (Groq, OpenAI, Gemini, Anthropic, OpenRouter, Azure, DeepSeek, Mistral, Ollama).
- **MCP Protocol**: Native MCP Server (Protocol `2024-11-05`) with SSE transport and JSON-RPC 2.0 at `/mcp/sse` and `/mcp/message`.
- **Infrastructure**: Neon Serverless PostgreSQL, Upstash Redis (TLS), Render (API Gateway), Vercel (SPA).

---

## 2. Core Architectural Pillars

### Multi-Provider Strategy & Privacy
- Dynamic provider registry allowing users to select cloud LLMs in **AI Settings** (`/settings`) without requiring local GPUs.
- Column-level AES-256-GCM encryption with unique 12-byte IVs (`gcm:v1:`) for user API keys stored in PostgreSQL.

### Model Context Protocol (MCP) & Autonomous Agent
- Exposes 4 role-governed educational tools: `get_course_details`, `get_student_analytics`, `create_assignment_draft`, and `search_course_knowledge`.
- Internal `McpAgentService` analyzes natural-language chat intent, bypasses trivial queries to conserve tokens, and applies a 3-hop recursion guard.

### Defense-in-Depth SQL Guardrails
- Ask-AI queries a dedicated `student` demo dataset, completely isolated from operational user accounts.
- `SqlValidator` uses JSqlParser to enforce single-`SELECT` statements, reject system schemas (`pg_*`, `information_schema`), and block sensitive columns.

### Unified Design System
- Pitch-black monochrome surface (`#000000`) with shared CSS tokens (`--home-*`) across landing and authentication pages.
- Collapsible sidebar accessible via header button, desktop edge chevron, or `Ctrl+B` shortcut.

---

## 3. Engineering Status & Roadmap

- **Audit Score**: 8.7/10 (Production Deployable under active iteration).
- **Next Engineering Milestones**:
  1. Restrict role modification in `PUT /api/users/{id}` to `ROLE_ADMIN`.
  2. Unify Axios response interceptors to streamline 401/403 handling.
  3. Add `@SpringBootTest` integration tests for endpoint `@PreAuthorize` security.
  4. Connect client-persisted gradebook workflows to backend relational tables.
  5. Remove unused WebSocket/STOMP boilerplate from frontend bundle.
