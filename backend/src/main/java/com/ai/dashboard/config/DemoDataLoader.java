package com.ai.dashboard.config;

import com.ai.dashboard.ai.rag.model.ChatMessage;
import com.ai.dashboard.ai.rag.model.ConversationSession;
import com.ai.dashboard.ai.rag.repository.ChatMessageRepository;
import com.ai.dashboard.ai.rag.repository.ConversationSessionRepository;
import com.ai.dashboard.document.entity.Document;
import com.ai.dashboard.document.repository.DocumentRepository;
import com.ai.dashboard.entity.*;
import com.ai.dashboard.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DemoDataLoader {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final DocumentRepository documentRepository;
    private final ConversationSessionRepository conversationSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner loadDemoData() {
        return args -> {
            if (courseRepository.count() >= 20 && userRepository.count() >= 110) {
                log.info("Demo data already exists. Skipping initialization.");
                return;
            }

            log.info("Loading demo data...");

            // Ensure roles exist
            Role teacherRole = roleRepository.findByName("ROLE_TEACHER")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_TEACHER").build()));
            Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_STUDENT").build()));

            Random random = new Random();

            // 1. Create 10 Teacher Users
            List<User> teachers = new ArrayList<>();
            for (int i = 1; i <= 10; i++) {
                String username = "teacher" + i;
                if (!userRepository.existsByUsername(username)) {
                    User teacher = User.builder()
                            .username(username)
                            .email("teacher" + i + "@school.com")
                            .password(passwordEncoder.encode("password123"))
                            .enabled(true)
                            .accountNonExpired(true)
                            .accountNonLocked(true)
                            .credentialsNonExpired(true)
                            .createdAt(LocalDateTime.now().minusMonths(6))
                            .roles(Set.of(teacherRole))
                            .build();
                    teachers.add(userRepository.save(teacher));
                } else {
                    userRepository.findByUsername(username).ifPresent(teachers::add);
                }
            }
            log.info("Created 10 teachers");

            // 2. Create 100 Student Users (and Student entity records if needed)
            List<User> studentUsers = new ArrayList<>();
            String[] firstNames = {"Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Ananya", "Aadhya", "Diya", "Sanya", "Priya", "Neha", "Pooja", "Riya", "Kavya", "Tanvi"};
            String[] lastNames = {"Sharma", "Verma", "Gupta", "Malhotra", "Mehta", "Patel", "Reddy", "Iyer", "Nair", "Das", "Singh", "Kumar", "Joshi", "Bose", "Sen"};
            String[] subjects = {"Mathematics", "Computer Science", "Physics", "Chemistry", "English Literature"};
            String[] coursesList = {"Java Fundamentals", "Spring Boot", "React", "Python", "Database Design"};

            for (int i = 1; i <= 100; i++) {
                String firstName = firstNames[random.nextInt(firstNames.length)];
                String lastName = lastNames[random.nextInt(lastNames.length)];
                String fullName = firstName + " " + lastName;
                String username = "student" + i + "_" + firstName.toLowerCase();
                String email = "student" + i + "@school.com";

                if (!userRepository.existsByUsername(username)) {
                    User studentUser = User.builder()
                            .username(username)
                            .email(email)
                            .password(passwordEncoder.encode("password123"))
                            .enabled(true)
                            .accountNonExpired(true)
                            .accountNonLocked(true)
                            .credentialsNonExpired(true)
                            .createdAt(LocalDateTime.now().minusMonths(1 + random.nextInt(10)))
                            .roles(Set.of(studentRole))
                            .build();
                    User savedUser = userRepository.save(studentUser);
                    studentUsers.add(savedUser);

                    // Also ensure student table has records if required
                    if (studentRepository.count() < 100) {
                        Student studentEntity = Student.builder()
                                .name(fullName)
                                .course(coursesList[random.nextInt(coursesList.length)])
                                .subject(subjects[random.nextInt(subjects.length)])
                                .fee(5000.0 + random.nextInt(5000))
                                .address("Metropolis, Street " + i)
                                .joiningDate(LocalDate.now().minusMonths(1 + random.nextInt(10)))
                                .build();
                        studentRepository.save(studentEntity);
                    }
                } else {
                    userRepository.findByUsername(username).ifPresent(studentUsers::add);
                }
            }
            log.info("Created 100 students");

            // 3. Create 20 Courses
            List<String> courseTitles = List.of(
                    "Java Fundamentals", "Spring Boot", "Microservices", "React", "Docker",
                    "Kubernetes", "AWS", "Kafka", "Hibernate", "SQL",
                    "Data Structures", "Algorithms", "Web Development", "Cloud Computing", "DevOps",
                    "Machine Learning", "Artificial Intelligence", "Cybersecurity", "Database Design", "Software Engineering"
            );
            List<Course> courses = new ArrayList<>();
            for (int i = 0; i < courseTitles.size(); i++) {
                String title = courseTitles.get(i);
                String code = "CRS" + (101 + i);
                if (!courseRepository.existsByCourseCode(code)) {
                    User teacher = teachers.get(random.nextInt(teachers.size()));
                    Course course = Course.builder()
                            .courseCode(code)
                            .title(title)
                            .description("Comprehensive course on " + title)
                            .teacher(teacher)
                            .status(Course.Status.ACTIVE)
                            .createdAt(LocalDateTime.now().minusMonths(8))
                            .build();
                    courses.add(courseRepository.save(course));
                } else {
                    courseRepository.findAll().stream().filter(c -> c.getCourseCode().equals(code)).findFirst().ifPresent(courses::add);
                }
            }
            log.info("Created 20 courses");

            // 4. Create 500 Enrollments
            List<Enrollment> enrollments = new ArrayList<>();
            Set<String> enrollmentKeys = new HashSet<>();
            while (enrollments.size() < 500 && !studentUsers.isEmpty() && !courses.isEmpty()) {
                User student = studentUsers.get(random.nextInt(studentUsers.size()));
                Course course = courses.get(random.nextInt(courses.size()));
                String key = student.getId() + "-" + course.getId();
                if (!enrollmentKeys.contains(key)) {
                    enrollmentKeys.add(key);
                    Enrollment enrollment = Enrollment.builder()
                            .student(student)
                            .course(course)
                            .enrollmentDate(LocalDate.now().minusDays(1 + random.nextInt(350)))
                            .status(Enrollment.Status.ENROLLED)
                            .progress(random.nextInt(101))
                            .build();
                    enrollments.add(enrollmentRepository.save(enrollment));
                }
            }
            log.info("Created 500 enrollments");

            // 5. Create 100 Documents
            List<String> docNames = List.of("lecture1.pdf", "assignment1.pdf", "spring-notes.pdf", "docker-guide.pdf", "syllabus.pdf", "lab-manual.pdf", "reference-book.pdf");
            List<Document.DocumentType> docTypes = List.of(Document.DocumentType.LECTURE_NOTES, Document.DocumentType.ASSIGNMENT, Document.DocumentType.REFERENCE, Document.DocumentType.SYLLABUS);
            List<Document> documents = new ArrayList<>();
            for (int i = 1; i <= 100; i++) {
                String baseName = docNames.get(random.nextInt(docNames.size()));
                String name = i + "_" + baseName;
                User teacher = teachers.get(random.nextInt(teachers.size()));
                Course course = courses.get(random.nextInt(courses.size()));
                Document doc = Document.builder()
                        .filename(name)
                        .originalFilename(name)
                        .contentType("application/pdf")
                        .fileSize(1024L * (100 + random.nextInt(4901)))
                        .uploadedBy(teacher)
                        .uploadTime(LocalDateTime.now().minusDays(1 + random.nextInt(180)))
                        .documentType(docTypes.get(random.nextInt(docTypes.size())))
                        .course(course)
                        .storagePath("/uploads/" + name)
                        .processingStatus(Document.ProcessingStatus.COMPLETED)
                        .build();
                documents.add(documentRepository.save(doc));
            }
            log.info("Created 100 documents");

            // 6. Create 50 Conversation Sessions
            List<ConversationSession> sessions = new ArrayList<>();
            List<User> allUsers = new ArrayList<>();
            allUsers.addAll(teachers);
            allUsers.addAll(studentUsers);

            for (int i = 1; i <= 50; i++) {
                User user = allUsers.get(random.nextInt(allUsers.size()));
                ConversationSession session = ConversationSession.builder()
                        .sessionId("sess-" + UUID.randomUUID())
                        .userId(user.getId())
                        .title("Chat Session " + i)
                        .createdAt(LocalDateTime.now().minusDays(1 + random.nextInt(30)))
                        .updatedAt(LocalDateTime.now())
                        .messageCount(4)
                        .totalTokens(500)
                        .build();
                sessions.add(conversationSessionRepository.save(session));
            }
            log.info("Created 50 sessions");

            // 7. Create 200 Chat Messages
            List<String> questions = List.of(
                    "How do Java Streams work?",
                    "Explain Dependency Injection.",
                    "What is Spring Security?",
                    "Difference between Docker and Kubernetes?",
                    "How do I optimize SQL queries?"
            );
            List<String> answers = List.of(
                    "Java Streams provide a declarative pipeline approach for processing collections of objects.",
                    "Dependency Injection is a design pattern in which an object receives other objects that it depends on.",
                    "Spring Security is a powerful and highly customizable authentication and access-control framework.",
                    "Docker is a containerization platform, while Kubernetes is an orchestrator for managing containers at scale.",
                    "SQL queries can be optimized by adding proper indexes, avoiding SELECT *, and analyzing execution plans."
            );

            int msgCount = 0;
            for (ConversationSession session : sessions) {
                for (int m = 0; m < 4; m += 2) {
                    ChatMessage qMsg = ChatMessage.builder()
                            .session(session)
                            .role(ChatMessage.Role.USER)
                            .content(questions.get(random.nextInt(questions.size())))
                            .tokenCount(50)
                            .createdAt(LocalDateTime.now().minusMinutes(10 - m))
                            .build();
                    chatMessageRepository.save(qMsg);

                    ChatMessage aMsg = ChatMessage.builder()
                            .session(session)
                            .role(ChatMessage.Role.ASSISTANT)
                            .content(answers.get(random.nextInt(answers.size())))
                            .tokenCount(100)
                            .createdAt(LocalDateTime.now().minusMinutes(9 - m))
                            .build();
                    chatMessageRepository.save(aMsg);
                    msgCount += 2;
                }
            }
            log.info("Created 200 chat messages");

            // 8. Create Assignments & Submissions if empty
            if (assignmentRepository.count() == 0 && !courses.isEmpty() && !teachers.isEmpty()) {
                for (int i = 0; i < courses.size(); i++) {
                    Course course = courses.get(i);
                    User teacher = course.getTeacher() != null ? course.getTeacher() : teachers.get(0);
                    Assignment assignment = Assignment.builder()
                            .title("Assignment " + (i + 1) + " for " + course.getTitle())
                            .description("Complete all exercises for " + course.getTitle())
                            .instructions("Submit your work as a PDF or text file.")
                            .dueDate(LocalDateTime.now().plusDays(7 + i))
                            .maxMarks(100)
                            .status(Assignment.Status.PUBLISHED)
                            .teacher(teacher)
                            .course(course)
                            .build();
                    Assignment savedAssignment = assignmentRepository.save(assignment);

                    if (!studentUsers.isEmpty()) {
                        User student = studentUsers.get(i % studentUsers.size());
                        Submission submission = Submission.builder()
                                .assignment(savedAssignment)
                                .student(student)
                                .submissionText("Here is my completed assignment submission.")
                                .status(i % 2 == 0 ? Submission.Status.SUBMITTED : Submission.Status.GRADED)
                                .obtainedMarks(i % 2 == 0 ? null : 85)
                                .submittedAt(LocalDateTime.now().minusDays(1))
                                .build();
                        submissionRepository.save(submission);
                    }
                }
                log.info("Created demo assignments and submissions");
            }

            log.info("Demo data loaded successfully.");
        };
    }
}
