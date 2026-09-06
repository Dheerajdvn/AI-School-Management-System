# 🏗️ Architecture Documentation

## System Architecture

```mermaid
graph TB
    subgraph Frontend ["React SPA — Vercel"]
        A[React 18 + Vite 5] --> B[AuthContext & ThemeContext]
        A --> C[Role-based ProtectedLayout]
        C --> D[Collapsible Sidebar + Topbar]
        D --> E[Student Portal]
        D --> F[Teacher Portal]
        D --> G[Admin & School Admin Portals]
        A --> H[Public Pages]
        H --> I[HomePage — LandingBgCanvas]
        H --> J[LoginPage — Shared Tokens]
    end

    subgraph Backend ["Spring Boot 3.5 API — Render"]
        K[Spring Boot 3.5] --> L[REST Controllers & MCP Server]
        K --> M[JWT & Rate Limiting Filter]
        K --> N[Service Layer]
        N --> ProviderRegistry[ProviderRegistry — 9 LLM Strategies]
        N --> O[Spring Data JPA Repositories]
        N --> VectorStore[VectorStoreService — Qdrant]
    end

    subgraph External ["Cloud Infrastructure"]
        P[(Neon PostgreSQL Cloud)]
        Q[(Upstash Redis TLS Cache)]
        R[(Qdrant Cloud Vector DB — 768-dim)]
        S["Cloud LLMs (Groq / OpenAI / Gemini / Anthropic / DeepSeek)"]
        T[Local Ollama Engine — Optional]
    end

    A <-->|HTTPS / REST / JWT Bearer| K
    K <--> P
    K <--> Q
    VectorStore <--> R
    ProviderRegistry <--> S
    ProviderRegistry <--> T
```

---

## Frontend Package Structure

```text
frontend/src/
├── App.jsx                    # Main router — 105+ lazy-loaded role-guarded routes
├── main.jsx                   # React entry point, ThemeProvider, AuthProvider
├── api/                       # Axios clients (authApi, dashboardApi, aiConfigApi)
├── components/
│   ├── landing/               # Landing sections (Hero, FeatureGrid, Pricing, etc.) + LandingBgCanvas
│   ├── Sidebar.jsx            # Role-aware collapsible sidebar
│   ├── Topbar.jsx             # Persistent sidebar toggle, search, theme switch
│   └── FloatingAIAssistant.jsx# Global floating AI assistant widget
├── context/
│   ├── AuthContext.jsx        # JWT lifecycle, user state, offline fallback
│   └── ThemeContext.jsx       # Theme state (dark/light) via data-theme and body classes
├── layouts/
│   └── ProtectedLayout.jsx    # Shell layout: Sidebar + Topbar + Ctrl+B listener
├── pages/                     # Public (HomePage, LoginPage) & Portals (Admin, Teacher, Student, School)
└── styles/                    # Modular CSS design system (tokens, layout, pages, themes)
```

---

## Backend Package Structure

```text
backend/src/main/java/com/ai/dashboard/
├── AiStudentDashboardApplication.java   # Application entry point
├── ai/                                  # AI & RAG Subsystem
│   ├── controller/                      # ChatController, AiConfigController
│   ├── prompt/                          # Tutor, Homework, Quiz, LessonPlanner, DocumentQA templates
│   ├── provider/                        # Strategy layer: LlmProviderStrategy & ProviderRegistry (9 providers)
│   ├── rag/                             # RagService orchestration
│   ├── embedding/                       # EmbeddingServiceImpl (nomic-embed-text 768-dim)
│   └── vector/                          # QdrantProvider & VectorStoreProperties
├── config/                              # SecurityConfig, RedisConfig, RateLimitingFilter, HealthIndicators
├── controller/                          # REST Controllers (Auth, School, Student, Course, Dashboard)
├── document/                            # Document upload, chunking (PDFBox/POI), and storage
├── entity/                              # JPA Entities (User, UserAiConfig, Course, Enrollment, etc.)
├── mcp/                                 # Model Context Protocol (MCP) Server
│   ├── protocol/                        # JSON-RPC 2.0 models & McpToolDefinition schemas
│   ├── server/                          # McpServerController (/mcp/sse, /mcp/message)
│   ├── tools/                           # McpTool contract, McpToolRegistry & 4 built-in tools
│   └── agent/                           # McpAgentService — autonomous intent routing & 3-hop loop guard
├── repository/                          # Spring Data JPA repositories
├── security/                            # JwtAuthenticationFilter & CustomUserDetailsService
├── service/                             # Business domain services
├── validator/                           # SqlValidator — JSqlParser AST whitelist for Ask-AI
└── util/                                # AesEncryptionConverter (AES-256-GCM API key encryption)
```

---

## MCP Server Endpoints

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/mcp/sse` | Optional | Establish persistent MCP SSE session (30-min timeout). Emits `endpoint` URI. |
| `POST` | `/mcp/message?sessionId={id}` | JWT | JSON-RPC 2.0 message handler (`initialize`, `tools/list`, `tools/call`, `ping`). |

---

## Security & Encryption Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant CustomUserDetailsService
    participant JwtTokenProvider
    participant AesEncryptionConverter
    participant PostgreSQL

    Client->>AuthController: POST /api/auth/login (username/email, password)
    AuthController->>CustomUserDetailsService: loadUserByUsername / findByEmail
    CustomUserDetailsService-->>AuthController: UserDetails
    AuthController->>JwtTokenProvider: generateToken (24h validity)
    AuthController-->>Client: {accessToken, refreshToken}
    Client->>AiConfigController: POST /api/ai/config (Provider, API Key)
    AiConfigController->>AesEncryptionConverter: convertToDatabaseColumn (API Key)
    AesEncryptionConverter->>PostgreSQL: Store AES-256-GCM Encrypted Key (gcm:v1: prefix)
```

---

## Dynamic AI Request Flow

```mermaid
flowchart LR
    A[User Query] --> B[RagService]
    B --> C[EmbeddingService]
    C --> D[768-dim Vector]
    B --> E[VectorStoreService]
    E --> F[Qdrant Similarity Search]
    B --> G[ProviderRegistry]
    G --> H{Provider Choice}
    H -->|Cloud Provider| I[Cloud LLM — SSE Streaming]
    H -->|Local Fallback| J[Ollama Engine]
    I --> K[Response + Source Citations]
    J --> K
```

---

## UI Theme Architecture

```mermaid
graph TD
    ThemeContext["ThemeContext (dark/light)"] --> DataTheme["data-theme attr on html"]
    ThemeContext --> BodyClass["body.dark-mode / body.light-mode"]
    
    DataTheme --> LandingCSS["landing.css --home-* tokens"]
    BodyClass --> LandingCSS
    
    LandingCSS --> HomePg[".home-page (Landing)"]
    LandingCSS --> LoginPg[".login-page (Login)"]
    LandingBgCanvas["LandingBgCanvas.jsx"] --> HomePg
    LandingBgCanvas --> LoginPg
```

---

## Core System Strategies

- **Sidebar Access**: 3 independent mechanisms — Topbar toggle button (always visible), floating left-edge trigger (`›`), and `Ctrl+B` shortcut.
- **Data Protection**: User LLM API keys encrypted at rest using AES-256-GCM with unique 12-byte IV per record.
- **Cache & Throttling**: Upstash Redis manages 30-minute analytics caching and sliding-window rate limiting.