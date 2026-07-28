# Deployment Guide

## Backend Deployment

### Production Configuration

Create [`application-prod.yml`](backend/src/main/resources/application.yml:1):
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
  redis:
    host: ${SPRING_REDIS_HOST}
    port: ${SPRING_REDIS_PORT}

server:
  port: 8080

logging:
  level:
    com.ai.dashboard: INFO

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,caches,beans,threaddump
```

### Docker Deployment

```bash
# Build JAR
./mvnw clean package -DskipTests

# Run with Docker
docker build -t ai-dashboard:latest .
docker run -d -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/schooldb \
  -e SPRING_REDIS_HOST=redis \
  ai-dashboard:latest
```

## Frontend Deployment

### Production Build
```bash
cd frontend
npm run build
```

### Serving Static Files
```bash
# Using Nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8080;
    }
}
```

## Environment Variables

### Backend Required
| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC URL | - |
| `SPRING_DATASOURCE_USERNAME` | DB username | - |
| `SPRING_DATASOURCE_PASSWORD` | DB password | - |
| `SPRING_REDIS_HOST` | Redis host | localhost |
| `SPRING_REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | JWT signing key | - |
| `JWT_EXPIRATION` | JWT expiry ms | 3600000 |
| `AI_OLLAMA_BASE_URL` | Ollama URL | http://localhost:11434 |
| `QDRANT_HOST` | Qdrant host | localhost |

### Frontend Required
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:8080 |

## Service Configuration

### PostgreSQL
```bash
# docker-compose.yml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: schooldb
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  volumes:
    - db-data:/var/lib/postgresql/data
  ports:
    - "5432:5432"
```

### Redis
```bash
# docker-compose.yml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
```

### Ollama
```bash
# Install and run
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
ollama pull qwen2.5:7b
```

### Qdrant
```bash
# docker-compose.yml
qdrant:
  image: qdrant/qdrant:v1.10.1
  ports:
    - "6333:6333"
    - "6334:6334"
  volumes:
    - qdrant_data:/qdrant/storage
```

## Production Checklist

- [ ] Set strong JWT secrets in [`application.yml`](backend/src/main/resources/application.yml:1)
- [ ] Configure HTTPS/TLS via Nginx / reverse proxy
- [ ] Enable database SSL
- [ ] Set up proper logging aggregation
- [ ] Configure backup for MariaDB
- [ ] Monitor Redis memory usage
- [ ] Secure Qdrant API endpoints
- [ ] Configure rate limiting
- [ ] Set up Prometheus monitoring
- [ ] Configure health check endpoints
