# 🎓 AI School Management & Analytics Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://react.dev/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> *An enterprise-grade, AI-powered School Management System featuring Retrieval-Augmented Generation (RAG), intelligent chatbots, lesson planners, role-based access control, and comprehensive academic analytics.*

---

## 2. Project Overview

### What Problem This Solves
Managing educational institutions requires handling complex administrative workflows—student records, teacher allocations, course enrollments, gradebooks, and document management—while modern educators increasingly demand AI assistance for lesson planning, quizzing, and document search. Traditional school management systems lack native artificial intelligence capabilities, requiring disjointed third-party plugins.

### Why It Was Built
This platform was built to demonstrate how enterprise-grade Java architectures (`Spring Boot`) and modern frontend SPAs (`React`) can be seamlessly integrated with cutting-edge AI pipelines (`Spring AI`, `LangChain4j`, `Ollama`, and `Qdrant`) to provide a unified, secure, and intelligent school administration ecosystem.

### Who Can Use It
- **Super Admins / Platform Owners**: Manage multi-tenant schools, system users, subscriptions, and platform-wide analytics.
- **School Admins**: Oversee individual school operations, classes, sections, subjects, teachers, and students.
- **Principals**: Monitor institutional performance analytics, attendance trends, financial reports, and risk detection.
- **Teachers**: Manage classrooms, mark attendance registers, grade assignments, generate AI quizzes and lesson plans, and upload study materials.
- **Students**: Track course progress, submit assignments, interact with AI tutors, practice quizzes, and view academic grades.
- **Parents**: Review children's academic performance reports, track attendance statistics, pay school fees, and communicate with teachers.

### Key Objectives
- Centralize school administrative and academic operations.
- Provide secure, stateless JWT-based multi-role authentication.
- Integrate local AI models (via Ollama) and vector databases (via Qdrant) for privacy-first Retrieval-Augmented Generation (RAG).

---

## 3. Project Features

### 🔐 Authentication & Security
- Stateless JWT Authentication with refresh token support.
- Role-Based Access Control (RBAC) supporting `ROLE_SUPER_ADMIN`, `ROLE_ADMIN`, `ROLE_SCHOOL_ADMIN`, `ROLE_TEACHER`, and `ROLE_STUDENT`.
- BCrypt password encryption and method-level security (`@PreAuthorize`).

### 🏫 School & Academic Management
- Multi-tenant School Onboarding with automated School Admin account provisioning.
- Student & Teacher Record Management with advanced pagination, search, and sorting.
- Course Offerings, Teacher Assignments, and Student Enrollments.

### 📋 Teacher Utilities
- **Gradebook Manager**: Automated grade converters, student average calculations, LocalStorage persistence, and PDF/CSV exporter tools.
- **Attendance Register**: Daily registers with single-action status switches and bulk markers.
- **AI Lesson Planner**: Generate structures and outlines based on topic targets.
- **AI Quiz Generator**: Draft dynamic question sheets instantly with multiple options and correct answer selectors.

### 📊 Dashboard & Analytics
- Real-time statistics cards showing total users, students, teachers, courses, documents, and AI chats.
- Interactive Chart.js and custom CSS visualizations for student enrollment by course, user growth, and document uploads.

### 🤖 AI Features & RAG
- **AI Chat Assistant**: Context-aware RAG assistant powered by Ollama and Qdrant.
- **Document Processing**: Upload PDFs and documents for automated chunking, embedding generation, and vector indexing.
- **AI Tools**: Dedicated AI Lesson Planner and Quiz Generator for educators.

---

## 4. System Architecture

```mermaid
graph TD
    Client[React Frontend SPA] -->|HTTP / Axios / JWT| Gateway[Spring Boot REST API / Security Filter]
    Gateway --> Controllers[REST Controllers]
    Controllers --> Services[Business Service Layer]
    Services --> Repositories[Spring Data JPA Repositories]
    Services --> SpringAI[Spring AI & LangChain4j]
    SpringAI --> Ollama[Ollama Local LLM]
    SpringAI --> Qdrant[Qdrant Vector Database]
    Repositories --> Database[(MariaDB / MySQL)]
```

---

## 5. Project Structure

### Backend Structure (`backend/`)
```text
backend/
│
├── src/main/java/com/ai/dashboard/
│   ├── ai/               # AI & RAG integrations (chat, embeddings, prompts, vector search)
│   ├── config/           # Spring configurations (security, async, initializers, demo data)
│   ├── controller/       # REST API controllers
│   ├── document/         # Document management & storage processing
│   ├── dto/              # Data Transfer Objects & Response wrappers
│   ├── entity/           # JPA persistent domain entities
│   ├── exception/        # Global exception handling & custom exceptions
│   ├── repository/       # Spring Data JPA repositories & Specifications
│   ├── security/         # JWT filter, token provider & user details service
│   ├── service/          # Business logic interfaces and implementations
│   └── util/             # Utility and helper classes
└── src/main/resources/   # Application YAML config, schema SQL, migrations
```

### Frontend Structure (`frontend/`)
```text
frontend/
│
├── src/
│   ├── api/              # Specific API integration clients
│   ├── components/       # Reusable UI components (tables, modals, cards, charts)
│   ├── constants/        # Routes, API endpoints, permissions, and roles
│   ├── context/          # React Context providers (Auth, Toast, Query)
│   ├── hooks/            # Custom React hooks (WebSockets, notifications, toast)
│   ├── layouts/          # Protected and public route layouts
│   ├── pages/            # View pages grouped by portal (Admin, School, Teacher, Student, AI)
│   ├── services/         # Core API services and Axios interceptors
│   └── utils/            # Formatting and token storage helpers
```

---

## 6. Technology Stack

| Category | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | 18.x | Single Page Application framework |
| | React Router | 6.x | Client-side routing and protected layouts |
| | Bootstrap | 5.x | Responsive styling and UI components |
| | Chart.js | 4.x | Data visualization and analytics charts |
| **Backend** | Java | 21 | Enterprise programming language |
| | Spring Boot | 3.x | Rapid application development framework |
| | Spring Data JPA | 3.x | Object-Relational Mapping & repositories |
| | Spring Security | 6.x | Authentication and method security |
| **Database** | PostgreSQL | 15.x+ | Relational data persistence |
| | H2 Database | Latest | In-memory database for unit/integration testing |
| **AI & Search** | Spring AI / LangChain4j | Latest | LLM abstraction and orchestration framework |
| | Ollama | Latest | Local LLM runner (e.g. `qwen2.5:7b` / `llama3`) |
| | Qdrant | Latest | Vector database for semantic RAG search |
| **Tooling** | Maven | Latest | Java build and dependency management |
| | Vite | Latest | Frontend build tool and dev server |

---

## 7. Prerequisites

Ensure you have the following installed on your system:
- **Java Development Kit (JDK) 21**
- **Node.js (v18+) & npm**
- **Maven (v3.8+)**
- **PostgreSQL (v15+)**
- **Ollama** (installed locally for AI features)
- **Qdrant** (running via Docker or locally for vector search)

---

## 8. Installation Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/dheerajdvn/ai-school-management-platform.git
cd ai-school-management-platform
```

### Step 2: Database Setup
Create a PostgreSQL database named `schooldb`:
```sql
CREATE DATABASE schooldb;
```

### Step 3: Configure Backend Properties
Edit `backend/src/main/resources/application.yml` to set your database username and password:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/schooldb
    username: postgres
    password: postgres_password
```

### Step 4: Install and Start Ollama & Qdrant
1. Download and run [Ollama](https://ollama.com/), then pull your desired model:
   ```bash
   ollama pull qwen2.5:7b
   ```
2. Run Qdrant (via Docker):
   ```bash
   docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
   ```

### Step 5: Build and Run the Backend
```bash
cd backend
./mvnw clean spring-boot:run
```
*(On Windows PowerShell, use `mvnw.cmd spring-boot:run`)*

### Step 6: Install and Run the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

### Step 7: Access the Application
Open your browser and navigate to `http://localhost:5173`. Log in with default admin credentials or use the auto-generated demo data.

---

## 9. Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/schooldb` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `postgres` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `YourSuperSecretJwtKeyForAuthenticationWithSufficientLength` |
| `OLLAMA_BASE_URL` | Ollama LLM service URL | `http://localhost:11434` |
| `QDRANT_HOST` | Qdrant vector database host | `localhost` |
| `QDRANT_PORT` | Qdrant gRPC / HTTP port | `6333` |

---

## 10. API Documentation

### Important Endpoints
- **Authentication**: `POST /api/auth/login`, `POST /api/auth/refresh`
- **Schools**: `GET /api/admin/schools`, `POST /api/admin/schools`, `PUT /api/admin/schools/{id}`
- **Students**: `GET /api/students`, `POST /api/students`, `PUT /api/students/{id}`
- **Courses**: `GET /api/courses`, `POST /api/courses`, `PUT /api/courses/{id}`
- **Dashboard**: `GET /api/dashboard/totals`, `GET /api/dashboard/enrollment-by-course`
- **AI RAG Chat**: `POST /api/ai/chat`

---

## 11. Database Schema

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned
    SCHOOLS ||--o{ USERS : administers
    USERS ||--o{ COURSES : teaches
    USERS ||--o{ ENROLLMENTS : enrolls
    COURSES ||--o{ ENROLLMENTS : contains
    USERS ||--o{ DOCUMENTS : uploads
    COURSES ||--o{ DOCUMENTS : relates
    USERS ||--o{ CONVERSATION_SESSIONS : opens
    CONVERSATION_SESSIONS ||--o{ CHAT_MESSAGES : contains
```

---

## 12. AI Workflow (RAG Pipeline)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant DocumentController
    participant EmbeddingService
    participant Qdrant as Qdrant Vector DB
    participant Ollama as Ollama LLM

    User->>Frontend: Upload Document (PDF)
    Frontend->>DocumentController: POST /api/documents
    DocumentController->>EmbeddingService: Chunk & Generate Embeddings
    EmbeddingService->>Qdrant: Store Vector Embeddings
    User->>Frontend: Ask AI Question
    Frontend->>Qdrant: Similarity Search
    Qdrant-->>Frontend: Retrieve Context Chunks
    Frontend->>Ollama: Prompt + Retrieved Context
    Ollama-->>User: AI Generated Answer
```

---

## 13. System Screenshots

Here are a few representative screenshots of the application:

## 📸 System Screenshots

The following screenshots showcase the major modules of **AI School Management & Analytics Platform**.

---

### 🌐 Landing Page

![Landing Page](docs/images/landing-page.png)

A modern AI-powered landing page showcasing the platform's capabilities, features, and enterprise-grade design.

---

### 🔐 Login

![Login](docs/images/login.png)

Secure JWT-based authentication with Role-Based Access Control (RBAC).

---

### 📊 School Admin Dashboard

![School Admin Dashboard](docs/images/school-dashboard.png)

Centralized dashboard for managing schools, users, courses, analytics, and AI-powered insights.

---

### 👨‍💼 Admin Dashboard

![Admin Dashboard](docs/images/admin-dashboard.png)

Platform administration with user management, subscriptions, reports, and system monitoring.

---

### 👨‍🏫 Teacher Dashboard

![Teacher Dashboard](docs/images/teacher-dashboard.png)

Teachers can manage classes, attendance, assignments, exams, grades, lesson planning, and analytics.

---

### 👨‍🎓 Student Dashboard

![Student Dashboard](docs/images/student-dashboard.png)

Students can view courses, assignments, attendance, grades, schedules, and AI-powered learning tools.

---

### 🤖 AI Chat Assistant (RAG)

![AI Chat](docs/images/ai-chat.png)

Enterprise AI Assistant powered by Spring AI, Ollama, LangChain4j, and Qdrant for Retrieval-Augmented Generation (RAG).

---

### 🧠 AI Quiz Generator

![AI Quiz Generator](docs/images/ai-quiz-generator.png)

Generate quizzes instantly using AI with configurable difficulty levels and question types.

---

### 📈 Analytics Dashboard

![Analytics Dashboard](docs/images/analytics.png)

Interactive dashboards with charts, KPIs, and real-time academic analytics.

---

### 📚 Knowledge Dashboard

![Knowledge Dashboard](docs/images/knowledge-dashboard.png)

Manage uploaded documents, vector embeddings, and AI knowledge sources.

---

### 📝 Attendance Management

![Attendance](docs/images/attendance.png)

Digital attendance tracking with role-based access and reporting.


---

## 14. Security
- **Stateless JWT**: Tokens validated on every secured request.
- **Role-Based Access Control**: Method-level `@PreAuthorize` guards restricting admin and teacher operations.
- **Password Encryption**: BCrypt hashing ensuring zero plain-text password exposure.

---

## 15. Testing
- **Backend Tests**: Run JUnit 5 & Mockito test suites via Maven:
  ```bash
  cd backend
  ./mvnw test
  ```

---

## 16. Future Enhancements
- Kubernetes deployment manifests and Helm charts.
- Advanced multi-tenant school isolation with schema-per-tenant support.
- Real-time video conferencing integration for virtual classrooms.

---

## 17. Troubleshooting
- **Database Connection Error**: Verify PostgreSQL service is running and credentials in `application.yml` match your local instance.
- **Ollama Connection Refused**: Ensure Ollama is running (`ollama serve`) and `qwen2.5:7b` model is downloaded.
- **Qdrant Connection Error**: Ensure Qdrant container is active on port `6333`.

---

## 18. Contributing
Contributions are welcome! Please fork the repository and submit a Pull Request.

---

## 19. License
This project is licensed under the [MIT License](LICENSE).

---

## 20. Author
- **Dheeraj DVN**
- GitHub: [@dheerajdvn](https://github.com/dheerajdvn)
- Email: dheeraj.dvn@example.com

---

## 21. Acknowledgements
- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)
- [Spring AI & LangChain4j](https://github.com/langchain4j/langchain4j)
- [Ollama](https://ollama.com/)
- [Qdrant](https://qdrant.tech/)
- Open Source Community
