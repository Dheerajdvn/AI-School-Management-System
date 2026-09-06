package com.ai.dashboard.mcp.tools.impl;

import com.ai.dashboard.entity.Assignment;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.mcp.tools.McpTool;
import com.ai.dashboard.repository.AssignmentRepository;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

/**
 * MCP Tool enabling teachers to draft new academic assignments.
 * Security & Guardrails:
 * - Restricted to TEACHER and ADMIN roles (RBAC).
 * - Safe by default: Always creates in 'DRAFT' status so teacher reviews before publishing.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AssignmentActionMcpTool implements McpTool {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    private static final Set<String> ALLOWED_ROLES = Set.of(
            "ROLE_TEACHER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_SCHOOL_ADMIN"
    );

    @Override
    public String getName() {
        return "create_assignment_draft";
    }

    @Override
    public String getDescription() {
        return "Creates a draft assignment for a course with instructions and max marks. Restricted to teachers.";
    }

    @Override
    public Map<String, Object> getInputSchema() {
        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "object");

        Map<String, Object> properties = new LinkedHashMap<>();

        Map<String, Object> titleProp = new LinkedHashMap<>();
        titleProp.put("type", "string");
        titleProp.put("description", "Assignment title (max 100 characters)");
        properties.put("title", titleProp);

        Map<String, Object> descProp = new LinkedHashMap<>();
        descProp.put("type", "string");
        descProp.put("description", "Brief description of the homework task");
        properties.put("description", descProp);

        Map<String, Object> instProp = new LinkedHashMap<>();
        instProp.put("type", "string");
        instProp.put("description", "Step-by-step instructions for students");
        properties.put("instructions", instProp);

        Map<String, Object> courseProp = new LinkedHashMap<>();
        courseProp.put("type", "string");
        courseProp.put("description", "Course code (e.g. 'CS101', 'JAVA201')");
        properties.put("courseCode", courseProp);

        Map<String, Object> marksProp = new LinkedHashMap<>();
        marksProp.put("type", "integer");
        marksProp.put("description", "Maximum marks (default: 100)");
        properties.put("maxMarks", marksProp);

        schema.put("properties", properties);
        schema.put("required", List.of("title", "courseCode"));
        return schema;
    }

    @Override
    public boolean isAuthorized(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        for (GrantedAuthority auth : authentication.getAuthorities()) {
            if (ALLOWED_ROLES.contains(auth.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public Map<String, Object> execute(Map<String, Object> arguments, Authentication authentication) {
        if (!isAuthorized(authentication)) {
            log.warn("Unauthorized assignment creation attempt by user {}", 
                    authentication != null ? authentication.getName() : "anonymous");
            return Map.of("error", "Access Denied: Only teachers and administrators can create assignments.");
        }

        String title = (String) arguments.get("title");
        String courseCode = (String) arguments.get("courseCode");
        String description = (String) arguments.getOrDefault("description", "Generated via AI Assistant");
        String instructions = (String) arguments.getOrDefault("instructions", "Complete the assigned questions.");
        Integer maxMarks = arguments.get("maxMarks") instanceof Number ? ((Number) arguments.get("maxMarks")).intValue() : 100;

        if (title == null || title.isBlank() || courseCode == null || courseCode.isBlank()) {
            return Map.of("error", "title and courseCode are required parameters");
        }

        log.info("MCP create_assignment_draft executing: title='{}', courseCode='{}'", title, courseCode);

        Optional<Course> courseOpt = courseRepository.findByCourseCode(courseCode.trim().toUpperCase());
        if (courseOpt.isEmpty()) {
            List<Course> all = courseRepository.findAll();
            courseOpt = all.stream()
                    .filter(c -> c.getTitle().toLowerCase().contains(courseCode.toLowerCase())
                            || c.getCourseCode().equalsIgnoreCase(courseCode))
                    .findFirst();
        }

        if (courseOpt.isEmpty()) {
            return Map.of("error", "Course not found for code: " + courseCode);
        }

        Course course = courseOpt.get();
        String username = authentication.getName();
        User teacher = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElse(course.getTeacher() != null ? course.getTeacher() : null);

        if (teacher == null) {
            return Map.of("error", "Could not resolve an active teacher account for assignment creation.");
        }

        try {
            Assignment assignment = Assignment.builder()
                    .title(title.length() > 100 ? title.substring(0, 97) + "..." : title)
                    .description(description.length() > 500 ? description.substring(0, 497) + "..." : description)
                    .instructions(instructions.length() > 1000 ? instructions.substring(0, 997) + "..." : instructions)
                    .course(course)
                    .teacher(teacher)
                    .maxMarks(maxMarks)
                    .dueDate(LocalDateTime.now().plusDays(7)) // default 1 week due date
                    .status(Assignment.Status.DRAFT) // Safe: Teacher reviews before publishing
                    .build();

            Assignment saved = assignmentRepository.save(assignment);
            log.info("Created draft assignment ID={} for course {}", saved.getId(), course.getCourseCode());

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("assignmentId", saved.getId());
            result.put("title", saved.getTitle());
            result.put("course", course.getCourseCode());
            result.put("maxMarks", saved.getMaxMarks());
            result.put("status", saved.getStatus().name());
            result.put("message", "Draft assignment created successfully! It is saved in DRAFT status for review.");
            return result;
        } catch (Exception e) {
            log.error("Failed to create draft assignment: {}", e.getMessage(), e);
            return Map.of("error", "Failed to create assignment: " + e.getMessage());
        }
    }
}
