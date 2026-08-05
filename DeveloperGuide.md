# 🛠️ Developer Guide

## Coding Standards

### Java Style
- Use Lombok annotations (`@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor`, `@Slf4j`).
- Use `camelCase` for methods/variables and `PascalCase` for classes.
- Encrypt sensitive fields using `@Convert(converter = AesEncryptionConverter.class)`.

### React Style
- Functional components with React Hooks (`useState`, `useEffect`, `useContext`).
- Theme-adaptive CSS variables (`var(--home-bg)`, `var(--text)`).
- Responsive mobile views (`@media (max-width: 576px)`).

---

## How to Add a New LLM Strategy

To add a new LLM provider (e.g. Cohere or AI21):

### 1. Implement `LlmProviderStrategy`
Create a new class in `com.ai.dashboard.ai.provider.impl`:

```java
@Component
@Slf4j
public class NewProviderStrategy implements LlmProviderStrategy {

    @Override
    public String getProviderName() {
        return "NEW_PROVIDER";
    }

    @Override
    public boolean isApiKeyRequired() {
        return true;
    }

    @Override
    public String chat(String apiKey, String baseUrl, String model, String prompt, double temperature, int maxTokens) {
        // Implement WebClient or HTTP call to Provider API
        return "AI Response";
    }

    @Override
    public boolean verifyConnection(String apiKey, String baseUrl) {
        // Verify API key connectivity
        return true;
    }

    @Override
    public List<String> getModels(String apiKey, String baseUrl) {
        return List.of("model-1", "model-2");
    }
}
```

### 2. Register Strategy
`ProviderRegistry` will automatically pick up your Spring `@Component` strategy bean upon startup!

---

## How to Add REST APIs

### 1. Create Controller
```java
@RestController
@RequestMapping("/api/resource")
@RequiredArgsConstructor
public class ResourceController {
    
    private final ResourceService resourceService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResource(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.get(id));
    }
}
```

### 2. Create Service & Repository
- Interface in `com.ai.dashboard.service`
- Implementation in `com.ai.dashboard.service.impl`
- Repository extending `JpaRepository<Entity, Long>`

---

## Testing & Verification

```bash
# Run unit & integration tests
cd backend
mvn test

# Frontend build verification
cd frontend
npm run build
```