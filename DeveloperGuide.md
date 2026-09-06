# 🛠️ Developer Guide

Coding standards, module extension patterns, and design system contracts.

---

## 1. Coding Standards

### Backend (Java 17 & Spring Boot 3.5)
- Standardize on Java 17 syntax (records, pattern matching, `var`).
- Utilize Lombok (`@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor`, `@Slf4j`).
- Field encryption for credentials via `@Convert(converter = AesEncryptionConverter.class)`.
- Global error handling via `@RestControllerAdvice`.
- Method-level access control via `@PreAuthorize("hasRole('...')")`.

### Frontend (React 18 & Vite 5)
- Functional components with React Hooks.
- **No hardcoded text colors**: Use CSS tokens (e.g. `style={{ color: 'var(--home-heading, #FFFFFF)' }}`).
- Shared landing/login layout pages must specify `home-page` or `login-page` on the container div.
- Verified responsive layouts with mobile-first styling.

---

## 2. Shared CSS Token System

The design system (`landing.css`) exposes CSS variables shared between `HomePage` and `LoginPage`:

```css
[data-theme="dark"] .home-page,
[data-theme="dark"] .login-page,
body.dark-mode .home-page,
body.dark-mode .login-page {
  --home-bg: #000000;
  --home-card-bg: rgba(13, 13, 16, 0.78);
  --home-border: rgba(255, 255, 255, 0.10);
  --home-heading: #FFFFFF;
  --home-paragraph: #A1A1AA;
  --home-muted: #71717A;
}
```

---

## 3. Adding an LLM Provider Strategy

1. Implement `LlmProviderStrategy` in `com.ai.dashboard.ai.provider.impl`:

```java
@Component
@Slf4j
public class CustomProviderStrategy implements LlmProviderStrategy {
    @Override public String getProviderName() { return "CUSTOM_PROVIDER"; }
    @Override public boolean isApiKeyRequired() { return true; }
    
    @Override
    public String chat(String apiKey, String baseUrl, String model, String prompt, double temperature, int maxTokens) {
        // Implement API call
        return "Response";
    }

    @Override public boolean verifyConnection(String apiKey, String baseUrl) { return true; }
    @Override public List<String> getModels(String apiKey, String baseUrl) { return List.of("model-a"); }
}
```

2. Spring automatically registers any `@Component` implementing `LlmProviderStrategy` into `ProviderRegistry`.

---

## 4. Adding an MCP Tool

1. Create a class implementing `McpTool` under `com.ai.dashboard.mcp.tools.impl`:

```java
@Component
public class ReportGeneratorMcpTool implements McpTool {
    @Override public String getName() { return "generate_report"; }
    @Override public String getDescription() { return "Generates academic report."; }
    @Override public Map<String, Object> getInputSchema() {
        return Map.of("type", "object", "properties", Map.of("term", Map.of("type", "string")));
    }
    @Override public boolean isAuthorized(Authentication auth) {
        return auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
    @Override public Map<String, Object> execute(Map<String, Object> args, Authentication auth) {
        return Map.of("reportUrl", "/reports/2026.pdf");
    }
}
```

2. `McpToolRegistry` discovers the bean automatically on startup.

---

## 5. Adding REST APIs

1. Controller in `com.ai.dashboard.controller`:
```java
@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {
    private final GradeService gradeService;

    @GetMapping("/student/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ResponseEntity<List<GradeDto>> getGrades(@PathVariable Long id) {
        return ResponseEntity.ok(gradeService.findByStudent(id));
    }
}
```
2. Implement service in `com.ai.dashboard.service.impl` and repository in `com.ai.dashboard.repository`.

---

## 6. Extending Frontend Navigation

1. **Sidebar Link**: Add an entry to the role's route list in `frontend/src/components/Sidebar.jsx`:
   ```jsx
   { path: '/grades', icon: 'bi-journal-check', label: 'Grades' }
   ```
2. **Register Route**: Add lazy-loaded route inside `frontend/src/App.jsx` wrapped in appropriate role guard.

---

## 7. Login Page Contract

`LoginPage.jsx` must strictly mirror the `HomePage.jsx` theme:
1. Root container class: `className="home-page login-page"`
2. Background: `<LandingBgCanvas />` (no custom color gradients)
3. Brand SVG: Planetary orbital atom logo
4. Styling: High-contrast primary button (`.dashdark-btn-primary`) and `--home-*` CSS variables

---

## 8. Sidebar Toggle Architecture

Sidebar visibility is controlled via `ProtectedLayout.jsx`:
- **Header Button**: Topbar toggle icon (always visible on mobile and desktop).
- **Edge Trigger**: Floating `›` chevron on desktop edge when collapsed.
- **Shortcut**: `Ctrl+B` (Windows/Linux) or `Cmd+B` (macOS).

---

## 9. Build & Verification Commands

```bash
# Verify backend build and unit tests
cd backend && mvn test

# Verify frontend production build (must return 0 errors)
cd frontend && npm run build
```