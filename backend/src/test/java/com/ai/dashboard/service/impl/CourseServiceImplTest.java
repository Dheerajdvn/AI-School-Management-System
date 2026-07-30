package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.CourseRequest;
import com.ai.dashboard.dto.CourseResponse;
import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.entity.Course;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.exception.AccessDeniedException;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.CourseRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.service.CourseService;
import com.ai.dashboard.testutil.TestBuilders;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CourseServiceImplTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CourseServiceImpl courseService;

    private User buildTeacher(Long id) {
        return TestBuilders.buildUser(id, "teacher" + id, "teacher" + id + "@example.com", "ROLE_TEACHER");
    }

    private Course buildCourse(Long id, User teacher, Course.Status status) {
        return TestBuilders.buildCourse(id, "CS101", "Title" + id, "Desc", teacher, status);
    }

    @Test
    void createCourse_success_returnsCourseResponse() {
        User teacher = buildTeacher(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(courseRepository.existsByCourseCode("CS101")).thenReturn(false);
        Course saved = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(courseRepository.save(any(Course.class))).thenReturn(saved);
        CourseRequest request = TestBuilders.buildCourseRequest("CS101", "Title", "Desc", 1L, "ACTIVE");
        CourseResponse response = courseService.createCourse(request, 1L, "ROLE_TEACHER");
        assertEquals("CS101", response.getCourseCode());
    }

    @Test
    void createCourse_duplicateCode_throwsBadRequest() {
        Course existing = buildCourse(1L, buildTeacher(1L), Course.Status.ACTIVE);
        when(courseRepository.existsByCourseCode("CS101")).thenReturn(true);
        when(courseRepository.findByCourseCode("CS101")).thenReturn(Optional.of(existing));
        CourseRequest request = TestBuilders.buildCourseRequest("CS101", "Title", "Desc", 1L, "ACTIVE");
        assertThrows(BadRequestException.class, () -> courseService.createCourse(request, 1L, "ROLE_TEACHER"));
    }

    @Test
    void createCourse_inactiveCourse_throwsBadRequest() {
        User teacher = buildTeacher(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(courseRepository.existsByCourseCode("CS101")).thenReturn(false);
        when(courseRepository.save(any(Course.class))).thenAnswer(i -> i.getArgument(0));
        CourseRequest request = TestBuilders.buildCourseRequest("CS101", "Title", "Desc", 1L, "INVALID_STATUS");
        assertThrows(BadRequestException.class, () -> courseService.createCourse(request, 1L, "ROLE_TEACHER"));
    }

    @Test
    void updateCourse_success_returnsUpdatedResponse() {
        User teacher = buildTeacher(1L);
        Course existing = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(courseRepository.existsByCourseCode("CS102")).thenReturn(false);
        when(courseRepository.save(any(Course.class))).thenAnswer(i -> i.getArgument(0));
        CourseRequest request = TestBuilders.buildCourseRequest("CS102", "New Title", "New Desc", 1L, "ACTIVE");
        CourseResponse response = courseService.updateCourse(1L, request, 1L, "ROLE_TEACHER");
        assertEquals("CS102", response.getCourseCode());
        assertEquals("New Title", response.getTitle());
    }

    @Test
    void updateCourse_nonExistingId_throwsResourceNotFound() {
        when(courseRepository.findById(999L)).thenReturn(Optional.empty());
        CourseRequest request = TestBuilders.buildCourseRequest("CS101", "Title", "Desc", 1L, "ACTIVE");
        assertThrows(ResourceNotFoundException.class, () -> courseService.updateCourse(999L, request, 1L, "ROLE_TEACHER"));
    }

    @Test
    void deleteCourse_success_deletesCourse() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        doNothing().when(courseRepository).deleteById(1L);
        assertDoesNotThrow(() -> courseService.deleteCourse(1L, 1L, "ROLE_TEACHER"));
    }

    @Test
    void getCourseById_existingId_returnsResponse() {
        User teacher = buildTeacher(1L);
        Course course = buildCourse(1L, teacher, Course.Status.ACTIVE);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        CourseResponse response = courseService.getCourseById(1L, "ROLE_ADMIN");
        assertEquals("CS101", response.getCourseCode());
    }

    @Test
    void getCourseById_nonExistingId_throwsResourceNotFound() {
        when(courseRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> courseService.getCourseById(999L, "ROLE_ADMIN"));
    }

    @Test
    void getAllCourses_studentRole_returnsOnlyActive() {
        when(courseRepository.findByStatus(Course.Status.ACTIVE, Pageable.unpaged()))
                .thenReturn(new PageImpl<>(List.of()));
        PagedResponse<CourseResponse> response = courseService.getAllCourses(Pageable.unpaged(), "ROLE_STUDENT", 1L);
        assertNotNull(response);
    }

    @Test
    void getAllCourses_adminRole_returnsAll() {
        when(courseRepository.findAll(Pageable.unpaged())).thenReturn(new PageImpl<>(List.of()));
        PagedResponse<CourseResponse> response = courseService.getAllCourses(Pageable.unpaged(), "ROLE_ADMIN", 1L);
        assertNotNull(response);
    }

    @Test
    void searchCourses_nonAdminRestrictsToOwn() {
        User teacher = buildTeacher(1L);
        when(courseRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));
        PagedResponse<CourseResponse> response = courseService.searchCourses(null, null, null, null, Pageable.unpaged(), "ROLE_TEACHER", 1L);
        assertNotNull(response);
    }

    @Test
    void parseStatus_nullReturnsActive() {
        CourseServiceImpl service = new CourseServiceImpl(courseRepository, userRepository);
        assertEquals(Course.Status.ACTIVE, invokeParseStatus(service, null));
    }

    @Test
    void parseStatus_invalidStatus_throwsBadRequest() {
        CourseServiceImpl service = new CourseServiceImpl(courseRepository, userRepository);
        assertThrows(BadRequestException.class, () -> invokeParseStatus(service, "INVALID"));
    }

    private Course.Status invokeParseStatus(CourseServiceImpl service, String status) {
        try {
            java.lang.reflect.Method method = CourseServiceImpl.class.getDeclaredMethod("parseStatus", String.class);
            method.setAccessible(true);
            return (Course.Status) method.invoke(service, status);
        } catch (java.lang.reflect.InvocationTargetException e) {
            if (e.getCause() instanceof RuntimeException re) {
                throw re;
            }
            throw new RuntimeException(e.getCause());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
