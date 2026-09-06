# 🔧 Troubleshooting Guide

Diagnostic solutions for common development and production issues.

---

## 1. Authentication & Access

### Login Fails / Offline Backend
- **Demo Accounts**:
  - Admin: `admin` / `password123`
  - Principal: `principal` / `password123`
  - Teacher: `teacher` / `password123`
  - Student: `student` / `password123`
- **Backend Sleeping**: If Render backend is spinning up, `admin` and `dheerajdvn` automatically trigger local session fallback in `AuthContext.jsx`.
- **JWT Lifespan**: Tokens are valid for 24 hours (`86,400,000 ms`). Refresh via `POST /api/auth/refresh`.

---

## 2. UI & Navigation

### Sidebar Hidden / Cannot Restore
1. **Topbar Button**: Click the sidebar icon (☰) in the dashboard header.
2. **Edge Trigger**: Click the floating `›` chevron on the left screen margin (desktop).
3. **Keyboard Shortcut**: Press `Ctrl + B` (Windows/Linux) or `Cmd + B` (macOS).

### Login Page Theme Inconsistency
- Ensure `LoginPage.jsx` root container has `className="home-page login-page"`.
- Verify background uses `<LandingBgCanvas />` and text relies on `--home-*` CSS variables.

---

## 3. Cloud & Backend Runtime

### Render Crash with `Exited with status 137` (OOM)
- **Cause**: Out-Of-Memory termination on Render's 512 MB free tier.
- **Fix**: Set environment variable in Render:
  ```text
  JAVA_OPTS = -Xmx320m -Xms256m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError
  ```

### AES Encryption Key Error at Startup
- **Cause**: Missing or short `APP_ENCRYPTION_KEY`.
- **Fix**: Provide an encryption key of at least 32 characters:
  ```bash
  export APP_ENCRYPTION_KEY="$(openssl rand -base64 32)"
  ```
- *Note: Changing this key will invalidate previously stored user API keys.*

### Ollama / AI Degraded Status
- **Cloud LLM Alternative**: Local Ollama is optional. Open **AI Settings** (`/settings`), choose **Groq** (free) or OpenAI/Gemini, enter your API key, and verify.
- **Local Ollama Fix**:
  ```bash
  ollama serve
  ollama pull qwen2.5-coder:3b
  ollama pull nomic-embed-text
  ```

---

## 4. Health & Verification Endpoints

| Endpoint | Target Component | Expected Status |
| :--- | :--- | :--- |
| `/api/actuator/health` | Overall Application | `{"status": "UP"}` |
| `/api/actuator/health/db` | PostgreSQL Connection | `{"status": "UP"}` |
| `/api/actuator/health/redis` | Upstash Redis TLS | `{"status": "UP"}` |
| `/api/actuator/health/qdrant` | Qdrant Cloud Vector Store | `{"status": "UP"}` |
| `/api/actuator/health/ollama` | Local Ollama Engine | `{"status": "OFFLINE"}` *(200 OK; optional)* |
