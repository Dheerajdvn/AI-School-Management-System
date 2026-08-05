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
| `APP_ENCRYPTION_KEY` | 16-byte AES Field Key | `1234567890123456` |
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
