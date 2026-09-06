# 🚀 Deployment Guide

Cloud deployment procedures for Render (Backend), Vercel (Frontend), Neon PostgreSQL, Upstash Redis, and Qdrant Cloud.

---

## 🌐 Live Infrastructure

| Component | Provider | URL / Host |
| :--- | :--- | :--- |
| **Frontend** | Vercel | [https://aischoolsystem.vercel.app](https://aischoolsystem.vercel.app) |
| **Backend API** | Render | [https://ai-school-management-system-l0a0.onrender.com](https://ai-school-management-system-l0a0.onrender.com) |
| **Database** | Neon Cloud | Serverless PostgreSQL 16+ (SSL enabled) |
| **Cache & Throttling**| Upstash Redis | Serverless Redis (TLS enabled) |
| **Vector Index** | Qdrant Cloud | `course_documents` 768-dim collection |

---

## ⚙️ Backend Environment Variables (Render)

Configure under **Render Dashboard** → **Environment**:

| Variable | Description | Value / Format |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Active profile | `prod` |
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC connection | `jdbc:postgresql://<host>/neondb?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Database username | Neon owner username |
| `SPRING_DATASOURCE_PASSWORD` | Database password | Neon owner password |
| `SPRING_REDIS_HOST` | Upstash Redis host | `<id>.upstash.io` |
| `SPRING_REDIS_PORT` | Upstash Redis port | `6379` |
| `SPRING_REDIS_PASSWORD` | Upstash Redis auth token | Upstash token string |
| `SPRING_REDIS_SSL` | Enable Redis TLS | `true` |
| `QDRANT_HOST` | Qdrant Cloud endpoint | `<cluster-id>.cloud.qdrant.io` |
| `QDRANT_PORT` | Qdrant port | `6333` |
| `QDRANT_API_KEY` | Qdrant Cloud API key | Qdrant secret key |
| `CORS_ALLOWED_ORIGINS` | Permitted frontend origins | `https://aischoolsystem.vercel.app` |
| `JWT_SECRET` | Token signature secret | 256-bit cryptographically secure string |
| `JWT_EXPIRATION` | Token expiry in ms | `86400000` (24 Hours) |
| `APP_ENCRYPTION_KEY` | AES-256 field encryption key | 32+ character key (`openssl rand -base64 32`) |
| `JAVA_OPTS` | Render memory constraints | `-Xmx320m -Xms256m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError` |

> [!IMPORTANT]
> **Preventing Render Exit Code 137 (OOM)**: Always set `JAVA_OPTS` to cap JVM heap at 320 MB, leaving overhead for off-heap and native memory on Render's 512 MB Free Tier.

---

## 💻 Frontend Deployment (Vercel)

1. Import GitHub repository into Vercel.
2. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variables:
   - `VITE_API_BASE_URL`: `https://ai-school-management-system-l0a0.onrender.com`

---

## 🤖 CI/CD Automation (Jenkins)

The included [`Jenkinsfile`](Jenkinsfile) automates build, test, and cloud redeployment upon commits to `main`.

### Required Jenkins Credentials
| Credential ID | Kind | Value |
| :--- | :--- | :--- |
| `RENDER_DEPLOY_HOOK` | Secret text | Render Web Service deploy hook URL |
| `VERCEL_DEPLOY_HOOK` | Secret text | Vercel Git deploy hook URL |

---

## ⏱️ Keep-Alive Job

Render free-tier instances sleep after inactivity. A GitHub Actions workflow (`.github/workflows/keep-alive.yml`) pings the health endpoint every 5 minutes:

```text
GET https://ai-school-management-system-l0a0.onrender.com/api/actuator/health
```

---

## 🐳 Local Development Setup

```bash
# 1. Start database, cache, and vector store
docker-compose up -d

# 2. Run backend
cd backend
export APP_ENCRYPTION_KEY="your-32-char-local-development-key"
mvn spring-boot:run

# 3. Run frontend
cd frontend
npm install
npm run dev
```
