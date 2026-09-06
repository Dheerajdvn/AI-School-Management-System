package com.ai.dashboard.mcp.tools.impl;

import com.ai.dashboard.entity.Course;
import com.ai.dashboard.mcp.tools.McpTool;
import com.ai.dashboard.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * MCP Tool to retrieve academic course information, teacher assignment, and curriculum codes.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CourseDetailsMcpTool implements McpTool {

    private final CourseRepository courseRepository;

    @Override
    public String getName() {
        return "get_course_details";
    }

    @Override
    public String getDescription() {
        return "Fetches course curriculum, syllabus title, and assigned teacher details by course code or ID.";
    }

    @Override
    public Map<String, Object> getInputSchema() {
        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "object");

        Map<String, Object> properties = new LinkedHashMap<>();

        Map<String, Object> codeProp = new LinkedHashMap<>();
        codeProp.put("type", "string");
        codeProp.put("description", "Course code (e.g. 'CS101', 'JAVA201') or course name");
        properties.put("courseCode", codeProp);

        schema.put("properties", properties);
        schema.put("required", List.of("courseCode"));
        return schema;
    }

    @Override
    public boolean isAuthorized(Authentication authentication) {
        // Course catalog information and curriculum details are publicly readable for all users and visitors
        return true;
    }

    @Override
    public Map<String, Object> execute(Map<String, Object> arguments, Authentication authentication) {
        String code = (String) arguments.get("courseCode");
        if (code == null || code.isBlank()) {
            return Map.of("error", "courseCode is required");
        }

        log.info("MCP get_course_details executing for courseCode={}", code);

        Optional<Course> courseOpt = courseRepository.findByCourseCode(code.trim().toUpperCase());
        if (courseOpt.isEmpty()) {
            // Fuzzy search over all courses
            List<Course> all = courseRepository.findAll();
            courseOpt = all.stream()
                    .filter(c -> c.getTitle().toLowerCase().contains(code.toLowerCase())
                            || c.getCourseCode().equalsIgnoreCase(code))
                    .findFirst();
        }

        if (courseOpt.isEmpty()) {
            return Map.of("message", "No course found matching '" + code + "'");
        }

        Course course = courseOpt.get();
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("id", course.getId());
        details.put("courseCode", course.getCourseCode());
        details.put("title", course.getTitle());
        details.put("description", course.getDescription() != null ? course.getDescription() : "N/A");
        String teacherName = course.getTeacher() != null ? course.getTeacher().getUsername() : "Unassigned";
        details.put("teacher", teacherName);
        details.put("teacherName", teacherName);
        details.put("status", course.getStatus() != null ? course.getStatus().name() : "ACTIVE");

        return details;
    }
}
