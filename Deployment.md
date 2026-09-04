# 🚀 Deployment Guide

## Production Architecture Overview

The AI School Management System is deployed across cloud infrastructure:

- **Frontend**: [Vercel](https://vercel.com) (`https://aischoolsystem.vercel.app`)
- **Backend API Gateway**: [Render](https://render.com) (`https://ai-school-management-system-l0a0.onrender.com`)
- **Database**: [Neon PostgreSQL Cloud](https://neon.tech)
- **Redis Cache & Rate Limiting**: [Upstash Redis Cloud](https://upstash.com)
- **Vector Database**: [Qdrant Cloud](https://qdrant.tech)

---

## Backend Deployment (Render)

### Production `application-prod.yml`
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: org.postgresql.Driver

  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: ${SPRING_JPA_HIBERNATE_DDL_AUTO:none}
    open-in-view: false

  data:
    redis:
      host: ${SPRING_REDIS_HOST}
      port: ${SPRING_REDIS_PORT}
      password: ${SPRING_REDIS_PASSWORD:}
      ssl:
        enabled: ${SPRING_REDIS_SSL:true}

ai:
  vector:
    provider: qdrant
    host: ${QDRANT_HOST}
    port: ${QDRANT_PORT}
    api-key: ${QDRANT_API_KEY:}

management:
  endpoint:
    health:
      show-details: always
```

---

## Required Production Environment Variables

Configure these environment variables in your **Render Web Service**:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Active Spring Profile | `prod` |
| `SPRING_DATASOURCE_URL` | Neon PostgreSQL JDBC URL | `jdbc:postgresql://ep-flat-union-...tech/neondb?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `neondb_owner` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `your-neon-password` |
| `SPRING_REDIS_HOST` | Upstash Redis Host | `popular-tahr-164365.upstash.io` |
| `SPRING_REDIS_PORT` | Upstash Redis Port | `6379` |
| `SPRING_REDIS_PASSWORD` | Upstash Redis Password | `your-upstash-token` |
| `SPRING_REDIS_SSL` | Enable Redis TLS | `true` |
| `QDRANT_HOST` | Qdrant Cloud Endpoint | `85d77988-d01f-4e95-8771-...cloud.qdrant.io` |
| `QDRANT_PORT` | Qdrant Port | `6333` |
| `QDRANT_API_KEY` | Qdrant Cloud API Key | `your-qdrant-api-key` |
| `CORS_ALLOWED_ORIGINS` | Allowed Frontend Origin | `https://aischoolsystem.vercel.app` |
| `JWT_SECRET` | JWT Secret Key | `your-secure-jwt-secret-key` |
| `JWT_EXPIRATION` | Token Expiry (ms) | `86400000` (24 Hours) |
| `APP_ENCRYPTION_KEY` | AES-256 Field Key (32+ chars, required in prod) | `openssl rand -base64 32` |
| `ADMIN_INIT_PASSWORD` | Initial admin password (admin creation skipped if unset) | `openssl rand -base64 24` |
| `JAVA_OPTS` | **Render Memory Heap Limit** | `-Xmx320m -Xms256m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError` |

> [!IMPORTANT]
> **Preventing Render Exit Code 137 (OOM)**:
> Setting `JAVA_OPTS` to `-Xmx320m -Xms256m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError` caps the Java heap at 320 MB, leaving 192 MB for off-heap and native memory. This guarantees your backend will **never** crash with Out-Of-Memory (Exit 137) on Render's 512 MB Free Tier!

---

## Frontend Deployment (Vercel)

1. Push your code to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. Set **Framework Preset**: `Vite`.
4. Set **Build Command**: `npm run build`.
5. Deploy. Vercel automatically proxies API calls using `vercel.json` rewrites to Render.

---

## 🤖 Automated CI/CD Deployment via Jenkins

The repository contains a [`Jenkinsfile`](file:///f:/ZCodeProject/Jenkinsfile) configured to automatically compile, build, test, and deploy the application to Render (Backend) and Vercel (Frontend) when changes are pushed to the `main` branch.

To enable the deployment triggers in Jenkins, you must configure the following credentials in Jenkins:

### 1. Backend Deployment (Render)
Render uses a unique deploy hook URL to trigger a redeploy of your service.
1. Go to your **Render Dashboard** and select your **Web Service**.
2. Scroll down to the **Deploy Hook** section and copy the URL (looks like `https://api.render.com/deploy/srv-...`).
3. Open your **Jenkins Server** -> **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials**.
4. Click **Add Credentials**:
   * **Kind**: `Secret text`
   * **Secret**: *Paste your Render Deploy Hook URL*
   * **ID**: `RENDER_DEPLOY_HOOK`
   * **Description**: `Render deploy hook URL for backend service`

### 2. Frontend Deployment (Vercel)
You can deploy to Vercel via **Deploy Hooks** (recommended for simplicity) or **Vercel API Token** (for direct CLI deployments).

#### Option A: Vercel Deploy Hook (Recommended)
1. Go to your **Vercel Dashboard** -> Select your project -> **Settings** -> **Git**.
2. Scroll down to **Deploy Hooks**, enter a name (e.g., `jenkins-deploy`), select your branch (`main`), and click **Create**.
3. Copy the generated webhook URL.
4. In **Jenkins** -> **Credentials** -> **Global credentials**, click **Add Credentials**:
   * **Kind**: `Secret text`
   * **Secret**: *Paste your Vercel Deploy Hook URL*
   * **ID**: `VERCEL_DEPLOY_HOOK`
   * **Description**: `Vercel deploy hook URL for frontend project`

#### Option B: Vercel CLI & API Token
If you want Jenkins to deploy using the Vercel CLI directly, add the following credential in Jenkins:
1. **`VERCEL_TOKEN`**: Go to your Vercel Account Settings -> **Tokens** -> Create a token.
2. In **Jenkins**, add the token as a `Secret text` credential with the ID `VERCEL_TOKEN`.

