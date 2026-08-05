# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

### 🤖 Ollama or Local LLM Not Running

**Symptom**: `Connection refused to Ollama (http://localhost:11434)` or Ollama shows `Degraded` in Admin Dashboard.

> [!TIP]
> **Recommended Quick Fix (No Ollama Needed)**:
> You do **not** need Ollama installed to use the AI features!
> 1. Open **AI Settings** (`/settings`).
> 2. Select **Groq** *(Free & Ultra-Fast Cloud AI)* or another provider like OpenAI, Gemini, or Anthropic.
> 3. Enter your API key, click **Verify Connection**, and click **Save Settings**.
> The system will immediately use your chosen cloud provider for all AI responses!

**Local Ollama Troubleshooting**:
```bash
# Check if Ollama is running locally
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Pull target models
ollama pull qwen2.5-coder:3b
ollama pull nomic-embed-text
```

---

### 💥 Render Container Crashes with `Exited with status 137`

**Cause**: Out-Of-Memory (OOM) killed by Linux kernel on Render's 512 MB Free Tier.

**Solution**:
Add `JAVA_OPTS` in **Render Dashboard** -> **Environment**:
```text
JAVA_OPTS = -Xmx320m -Xms256m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError
```
This caps Java heap at 320 MB, keeping total RAM safely under Render's 512 MB limit.

---

### 🔑 AES Encryption Key Length Error

**Error**: `InvalidAESKeyException: Invalid AES key length: X bytes`

**Solution**:
Set `APP_ENCRYPTION_KEY` in environment variables to an exact 16-byte string (e.g. `1234567890123456`).

---

### 🔐 JWT Authentication Problems

- **Token Expiration**: Access tokens are valid for **24 Hours** (`86400000ms`).
- **Format**: Requests must include header `Authorization: Bearer <token>`.
- **Refresh**: Use `POST /api/auth/refresh` to get a fresh token before expiration.

---

### 📊 Health Check Endpoints

| Endpoint | Purpose | Expected Response |
| :--- | :--- | :--- |
| `/api/actuator/health` | System Actuator aggregated health | `{"status": "UP", "components": {...}}` |
| `/api/actuator/health/db` | Neon PostgreSQL status | `{"status": "UP"}` |
| `/api/actuator/health/redis` | Upstash Redis status | `{"status": "UP"}` |
| `/api/actuator/health/qdrant` | Qdrant Cloud status | `{"status": "UP"}` |
| `/api/actuator/health/ollama` | Ollama local engine status | `{"status": "OFFLINE"}` *(Clean 200 OK status)* |
