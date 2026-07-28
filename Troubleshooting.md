# Troubleshooting Guide

## Common Issues

### JWT Problems

**Error: Invalid token received**
- Ensure `JWT_SECRET` is set and consistent across restarts
- Check token expiration time in `JWT_EXPIRATION` property
- Verify token format: `Authorization: Bearer <token>`

**Error: Token expired**
- Default token expires in 1 hour (3600000ms)
- Use refresh endpoint `/api/auth/refresh` to get new token
- Check system time if tokens expire immediately

### Redis Connection

**Error: Cannot connect to Redis**
```bash
# Check if Redis is running
docker ps | grep redis

# Test connection
redis-cli ping

# Check Redis logs
docker logs <redis-container-id>
```

**Solution:**
- Ensure `SPRING_REDIS_HOST` and `SPRING_REDIS_PORT` are correct
- Verify Redis container is accessible
- Check firewall rules

### PostgreSQL Connection

**Error: Connection refused**
```bash
# Check PostgreSQL status
docker ps | grep postgres

# Test connection
psql -h localhost -U postgres -d schooldb

# Check logs
docker logs <postgres-container-id>
```

**Solution:**
- Verify `SPRING_DATASOURCE_URL`, `USERNAME`, `PASSWORD` in [`application.yml`](backend/src/main/resources/application.yml:1)
- Ensure PostgreSQL is running on correct port (default: 5432)
- Check if database exists

### Ollama Not Running

**Error: Connection refused to Ollama**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Pull model
ollama pull qwen2.5:7b
```

**Solution:**
- Verify `AI_OLLAMA_BASE_URL` configuration
- Ensure model is downloaded
- Check system resources (Ollama needs significant RAM)

### Qdrant Connection

**Error: Cannot connect to Qdrant**
```bash
# Check Qdrant
curl http://localhost:6333/health

# Check logs
docker logs <qdrant-container-id>
```

**Solution:**
- Verify `QDRANT_HOST` and `QDRANT_PORT` settings
- Ensure Qdrant is accessible
- Check if collection exists

### Embedding Failures

**Error: Embedding generation failed**
- Check Ollama logs for memory issues
- Reduce batch size in `AI_OLLAMA_EMBEDDING_BATCH_SIZE`
- Verify input text is not empty

**Error: All chunks showing PENDING**
- Check embedding service status
- Verify Qdrant connection
- Review document processing logs

### WebSocket Issues

**Error: WebSocket connection failed**
- Check `/actuator/health` for WebSocket status
- Verify STOMP endpoint configuration
- Check firewall/proxy for WebSocket upgrade

**Error: Messages not delivered**
- Check subscription mappings in `WebSocketConfig`
- Verify message broker configuration
- Review broker relay logs

### Build Errors

**Error: Maven compilation failed**
```bash
# Clean and rebuild
./mvnw clean compile

# Skip tests for quick build
./mvnw install -DskipTests
```

**Error: Lombok annotation not working**
- Ensure Lombok plugin is installed in IDE
- Check `@Builder.Default` is added for primitive defaults
- Verify Lombok dependency is present

**Error: JaCoCo coverage check failed**
- Current threshold: 40% instruction coverage
- Add more tests to increase coverage
- Or lower threshold in pom.xml configuration

## Health Check Endpoints

| Endpoint | Purpose | Expected Response |
|----------|---------|-----------------|
| `/actuator/health` | Overall health | `{"status":"UP"}` |
| `/actuator/health/redis` | Redis health | `{"status":"UP"}` |
| `/actuator/health/ollama` | Ollama health | `{"status":"UP"}` |
| `/actuator/metrics` | Application metrics | JSON metrics |
| `/actuator/prometheus` | Prometheus format | Text metrics |

## Log Analysis

### Check Backend Logs
```bash
# Docker
docker logs -f <backend-container>

# Direct
tail -f backend/logs/application.log
```

### Key Log Patterns
- `ERROR` - Critical issues requiring attention
- `WARN` - Non-critical issues
- `RAG pipeline failed` - AI processing errors
- `Connection refused` - Service connectivity issues

## Performance Issues

### Slow API Responses
- Check `/actuator/metrics` for slow endpoints
- Verify Redis caching is enabled
- Check database query performance
- Review embedding/vector search times

### High Memory Usage
- Monitor JVM heap via `/actuator/metrics/jvm.memory.used`
- Check Redis memory: `redis-cli info memory`
- Limit Ollama model size or use quantized version

## Development Tips

### Quick Setup
```bash
# Reset all containers
docker-compose down -v
docker-compose up -d

# Recreate database
./mvnw spring-boot:run
```

### Debug Mode
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
```
