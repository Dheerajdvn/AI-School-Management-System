package com.ai.dashboard.mcp;

import com.ai.dashboard.ai.embedding.service.EmbeddingService;
import com.ai.dashboard.ai.rag.repository.DocumentChunkRepository;
import com.ai.dashboard.ai.vector.service.VectorStoreService;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.mcp.agent.McpAgentService;
import com.ai.dashboard.mcp.tools.McpToolRegistry;
import com.ai.dashboard.mcp.tools.impl.CourseDetailsMcpTool;
import com.ai.dashboard.mcp.tools.impl.KnowledgeSearchMcpTool;
import com.ai.dashboard.mcp.tools.impl.StudentAnalyticsMcpTool;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.StudentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class McpToolSecurityUnitTest {

    private CourseRepository courseRepository;
    private StudentRepository studentRepository;
    private EmbeddingService embeddingService;
    private VectorStoreService vectorStoreService;
    private DocumentChunkRepository chunkRepository;

    private CourseDetailsMcpTool courseTool;
    private KnowledgeSearchMcpTool knowledgeTool;
    private StudentAnalyticsMcpTool analyticsTool;
    private McpToolRegistry registry;
    private McpAgentService agentService;

    @BeforeEach
    void setUp() {
        courseRepository = Mockito.mock(CourseRepository.class);
        studentRepository = Mockito.mock(StudentRepository.class);
        embeddingService = Mockito.mock(EmbeddingService.class);
        vectorStoreService = Mockito.mock(VectorStoreService.class);
        chunkRepository = Mockito.mock(DocumentChunkRepository.class);

        courseTool = new CourseDetailsMcpTool(courseRepository);
        knowledgeTool = new KnowledgeSearchMcpTool(embeddingService, vectorStoreService, chunkRepository);
        analyticsTool = new StudentAnalyticsMcpTool(studentRepository);

        registry = new McpToolRegistry(List.of(courseTool, knowledgeTool, analyticsTool));
        agentService = new McpAgentService(registry, new ObjectMapper());
    }

    @Test
    @DisplayName("Anonymous users cannot access knowledge vector search but can view public course details")
    void testAnonymousAccessGuardrail() {
        Authentication anonymousAuth = new AnonymousAuthenticationToken(
                "key", "anonymousUser", List.of(new SimpleGrantedAuthority("ROLE_ANONYMOUS")));

        assertFalse(knowledgeTool.isAuthorized(anonymousAuth), "Anonymous user must NOT be authorized for Qdrant vector search");
        assertFalse(analyticsTool.isAuthorized(anonymousAuth), "Anonymous user must NOT be authorized for analytics");
        assertTrue(courseTool.isAuthorized(anonymousAuth), "Course details should be public for curriculum exploration");
    }

    @Test
    @DisplayName("Students cannot execute StudentAnalyticsMcpTool (Teacher/Admin only)")
    void testStudentRbacBoundary() {
        Authentication studentAuth = new UsernamePasswordAuthenticationToken(
                "student1", null, List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));

        assertFalse(analyticsTool.isAuthorized(studentAuth), "Student must NOT access institutional analytics");
        assertTrue(knowledgeTool.isAuthorized(studentAuth), "Student is authorized for textbook/notes search");
        assertTrue(courseTool.isAuthorized(studentAuth), "Student is authorized for course details");
    }

    @Test
    @DisplayName("CourseDetailsMcpTool provides both teacher and teacherName in output")
    void testCourseDetailsOutputFields() {
        User teacher = User.builder().username("prof_sharma").build();
        Course course = Course.builder()
                .id(101L)
                .courseCode("CS101")
                .title("Introduction to Computer Science")
                .description("Core programming course")
                .teacher(teacher)
                .build();

        when(courseRepository.findByCourseCode("CS101")).thenReturn(Optional.of(course));

        Authentication auth = new UsernamePasswordAuthenticationToken("student1", null, List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));
        Map<String, Object> output = courseTool.execute(Map.of("courseCode", "CS101"), auth);

        assertEquals("prof_sharma", output.get("teacher"));
        assertEquals("prof_sharma", output.get("teacherName"));
        assertEquals("CS101", output.get("courseCode"));
    }

    @Test
    @DisplayName("McpAgentService bypasses greetings with 0 token overhead")
    void testIntentBypassForGreetings() {
        assertFalse(agentService.shouldConsiderTools("hello"), "Greeting 'hello' must bypass MCP tool search");
        assertFalse(agentService.shouldConsiderTools("hi"), "Greeting 'hi' must bypass MCP tool search");
        assertTrue(agentService.shouldConsiderTools("what is in course CS101?"), "Course query must trigger MCP consideration");
    }
}
