# Developer Guide

## Coding Standards

### Java Style
- Use Lombok annotations (`@Getter`, `@Setter`, `@Builder`, `@Slf4j`)
- Follow camelCase for variables and methods
- Use meaningful class names
- Add Javadoc to public methods

### React Style
- Use functional components with hooks
- Follow kebab-case for filenames
- Use PascalCase for component names
- Separate concerns with custom hooks

## Package Structure

```
backend/src/main/java/com/ai/dashboard/
├── ai/            # AI/RAG functionality
│   ├── prompt/    # Prompt templates
│   ├── rag/       # RAG service layer
│   ├── embedding/ # Embedding generation
│   └── vector/    # Vector store integration
├── config/        # Spring configuration
├── controller/    # REST API endpoints
├── document/      # Document management
├── entity/        # JPA entities
├── exception/     # Custom exceptions
├── repository/    # Spring Data repositories
├── security/      # JWT authentication
└── service/       # Business logic
```

## How to Add APIs

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

### 2. Create Service
```java
@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {
    
    private final ResourceRepository resourceRepository;
    
    @Override
    public ResourceResponse get(Long id) {
        return resourceRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
    }
}
```

### 3. Add Tests
```java
@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {
    
    @Mock
    private ResourceRepository repository;
    
    @InjectMocks
    private ResourceServiceImpl service;
    
    @Test
    void should_get_resource_successfully() {
        // Test implementation
    }
}
```

## How to Add AI Prompts

### 1. Create Prompt Template
```java
@Component
public class NewPromptTemplate {
    
    private static final String SYSTEM_TEMPLATE = """
        You are an AI assistant specializing in...
        """;
    
    public String buildPrompt(String context, String question) {
        return SYSTEM_TEMPLATE + "\nContext: " + context + "\nQuestion: " + question;
    }
}
```

### 2. Inject into Service
```java
private final NewPromptTemplate promptTemplate;

String prompt = promptTemplate.buildPrompt(context, question);
```

## How to Add New Modules

### 1. Create Entity
```java
@Entity
@Table(name = "new_entity")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Add fields and indexes
}
```

### 2. Create Repository
```java
@Repository
public interface NewEntityRepository extends JpaRepository<NewEntity, Long> {
    // Add custom queries if needed
}
```

### 3. Create Service Layer
- Interface in `com.ai.dashboard.service`
- Implementation in `com.ai.dashboard.service.impl`

### 4. Create Controller
- REST controller in `com.ai.dashboard.controller`
- Add proper HTTP mappings

### 5. Add Tests
- Unit tests for service layer
- Integration tests for API endpoints

## Testing Guidelines

### Unit Test Structure
Use Nested classes for organization:

```java
@ExtendWith(MockitoExtension.class)
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
class ServiceTest {
    
    @Nested
    class GetResource {
        @Test
        void should_return_resource() { }
        
        @Test
        void should_throw_exception_when_not_found() { }
    }
}
```

### Test Coverage Goals
- Service layer: 80%+
- Controller layer: 70%+
- Repository layer: 60%+

### Running Tests
```bash
./mvnw test                    # Run all tests
./mvnw test -Dtest=*Controller # Run controller tests
./mvnw jacoco:report            # Generate coverage report
```

## Build and Run

### Development
```bash
# Backend
./mvnw spring-boot:run

# Frontend
npm run dev
```

### Production
```bash
# Backend
./mvnw clean package -DskipTests

# Frontend
npm run build
```

### Docker
```bash
docker-compose up -d