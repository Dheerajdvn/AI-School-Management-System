# 🏗️ Architecture Documentation

## System Architecture

```mermaid
graph TB
    subgraph Frontend [React SPA - Vercel]
        A[React App] --> B[AuthContext & ThemeContext]
        A --> C[Role-based Layouts]
        A --> D[Portals]
        D --> E[Student Portal]
        D --> F[Teacher Portal]
        D --> G[Admin & School Admin Portals]
    end

    subgraph Backend [Spring Boot API Gateway - Render]
        H[Spring Boot 3.5] --> I[REST Controllers]
        H --> L[Security & Rate Limiting Filter]
        H --> J[Service Layer]
        J --> ProviderRegistry[ProviderRegistry & 9 LLM Strategies]
        J --> K[Spring Data JPA Repositories]
        J --> VectorStore[VectorStoreService]
    end

    subgraph ExternalServices [Cloud & Dedicated Infrastructure]
        N[(Neon PostgreSQL Cloud)]
        O[(Upstash Redis Cloud Cache)]
        P[(Qdrant Cloud Vector DB)]
        Q["Cloud LLMs (Groq / OpenAI / Gemini / Anthropic)"]
        R[Local Ollama Engine]
    end

    A <-->|HTTPS / REST / JWT| H
    H <--> N
    H <--> O
    VectorStore <--> P
    ProviderRegistry <--> Q
    ProviderRegistry <--> R
```

---

## Backend Package Structure

```text
backend/src/main/java/com/ai/dashboard/
├── AiStudentDashboardApplication.java  # Main entry point
├── ai/                                # AI & RAG components
│   ├── controller/                    # ChatController, AiConfigController
│   ├── model/                         # OllamaProvider model wrapper
│   ├── prompt/                        # Prompt templates (Tutor, Homework, Quiz, LessonPlanner, DocumentQA)
│   ├── provider/                      # Multi-provider LLM strategy layer
│   │   ├── LlmProviderStrategy.java   # Strategy interface
│   │   ├── ProviderRegistry.java      # Registry mapping 9 providers
│   │   └── impl/                      # Groq, OpenAI, Gemini, Anthropic, OpenRouter, Azure, DeepSeek, Mistral, Ollama
│   ├── rag/                           # RAG pipeline & RagServiceImpl
│   ├── embedding/                     # EmbeddingServiceImpl (nomic-embed-text)
│   └── vector/                        # QdrantProvider & VectorStoreProperties
├── config/                            # Spring configurations
│   ├── health/                        # OllamaHealthIndicator, RedisHealthIndicator, QdrantHealthIndicator
│   ├── SecurityConfig.java
│   ├── RedisConfig.java
│   └── RateLimitingFilter.java        # Upstash Redis rate limiting
├── controller/                        # REST controllers (Auth, School, Student, Course, Dashboard)
├── document/                          # Document management & file storage
├── entity/                            # JPA entities (User, UserAiConfig, Course, Enrollment, etc.)
├── repository/                        # Spring Data JPA repositories
├── security/                          # JwtAuthenticationFilter & CustomUserDetailsService
├── service/                           # Business logic services
└── util/                              # AesEncryptionConverter (AES-256-GCM API key encryption)
```

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
    AesEncryptionConverter->>PostgreSQL: Store AES-256-GCM Encrypted Key
```

---

## Dynamic AI Request Flow

```mermaid
flowchart LR
    A[User Question] --> B[RagService]
    B --> C[EmbeddingService]
    C --> D[Generate Vector 768-dim]
    B --> E[VectorStoreService]
    E --> F[Qdrant Similarity Search]
    B --> G[LocalLLMService]
    G --> H[UserAiConfig Repository]
    H --> I{Provider Choice}
    I -->|Groq / Cloud| J[Groq / Cloud LLM API]
    I -->|Ollama / Fallback| K[Local Ollama Engine]
    J --> L[Return Answer + Sources]
    K --> L[Return Answer + Sources]
```

---

## Caching & Rate Limiting Strategy

- **Upstash Redis**: Stores 30-minute analytics caches (`entryTtl: 30 minutes`).
- **Rate Limiting**: `RateLimitingFilter` tracks IP/user request buckets in Redis.
- **TLS Encryption**: `SPRING_REDIS_SSL=true` for secure cloud connectivity.