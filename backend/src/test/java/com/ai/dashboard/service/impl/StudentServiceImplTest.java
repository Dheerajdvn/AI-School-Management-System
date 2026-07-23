package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.dto.StudentDto;
import com.ai.dashboard.entity.Student;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.StudentRepository;
import com.ai.dashboard.service.StudentService;
import com.ai.dashboard.testutil.TestBuilders;
import com.ai.dashboard.util.AppConstants;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    @Test
    void create_success_returnsStudentDto() {
        StudentDto dto = TestBuilders.buildStudentDto(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        Student saved = TestBuilders.buildStudent(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        when(studentRepository.save(any(Student.class))).thenReturn(saved);
        StudentDto result = studentService.create(dto);
        assertEquals("John", result.getName());
    }

    @Test
    void update_success_returnsUpdatedDto() {
        Student existing = TestBuilders.buildStudent(1L, "OldName", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        when(studentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(studentRepository.save(any(Student.class))).thenAnswer(i -> i.getArgument(0));
        StudentDto dto = TestBuilders.buildStudentDto(1L, "NewName", "Physics", "Mechanics", 2000.0, "456 St", LocalDate.now());
        StudentDto result = studentService.update(1L, dto);
        assertEquals("NewName", result.getName());
        assertEquals("Physics", result.getCourse());
    }

    @Test
    void update_nonExistingId_throwsResourceNotFound() {
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());
        StudentDto dto = TestBuilders.buildStudentDto(999L, "Name", "Course", "Subject", 1000.0, "Addr", LocalDate.now());
        assertThrows(ResourceNotFoundException.class, () -> studentService.update(999L, dto));
    }

    @Test
    void getById_existingId_returnsDto() {
        Student student = TestBuilders.buildStudent(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        StudentDto dto = studentService.getById(1L);
        assertEquals("John", dto.getName());
    }

    @Test
    void getById_nonExistingId_throwsResourceNotFound() {
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> studentService.getById(999L));
    }

    @Test
    void delete_existingId_deletesStudent() {
        when(studentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(studentRepository).deleteById(1L);
        assertDoesNotThrow(() -> studentService.delete(1L));
    }

    @Test
    void delete_nonExistingId_throwsResourceNotFound() {
        when(studentRepository.existsById(999L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> studentService.delete(999L));
    }

    @Test
    void getAll_returnsPagedResponse() {
        Student student = TestBuilders.buildStudent(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        Page<Student> page = new PageImpl<>(List.of(student));
        when(studentRepository.findAll(any(Pageable.class))).thenReturn(page);
        PagedResponse<StudentDto> response = studentService.getAll(0, 10, "id", "asc");
        assertEquals(1, response.getContent().size());
    }

    @Test
    void search_returnsPagedResponse() {
        Student student = TestBuilders.buildStudent(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        Page<Student> page = new PageImpl<>(List.of(student));
        when(studentRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(Pageable.class))).thenReturn(page);
        PagedResponse<StudentDto> response = studentService.search("John", "Math", "Algebra", "City", 1000.0, 2000.0, LocalDate.now(), LocalDate.now(), 0, 10, "id", "asc");
        assertEquals(1, response.getContent().size());
    }

    @Test
    void keywordSearch_returnsPagedResponse() {
        Student student = TestBuilders.buildStudent(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        Page<Student> page = new PageImpl<>(List.of(student));
        when(studentRepository.findByNameContainingIgnoreCaseOrCourseContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrAddressContainingIgnoreCase(
                anyString(), anyString(), anyString(), anyString(), any(Pageable.class))).thenReturn(page);
        PagedResponse<StudentDto> response = studentService.keywordSearch("John", 0, 10);
        assertEquals(1, response.getContent().size());
    }

    @Test
    void keywordSearch_nullKeyword_normalizesToEmpty() {
        Student student = TestBuilders.buildStudent(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        Page<Student> page = new PageImpl<>(List.of(student));
        when(studentRepository.findByNameContainingIgnoreCaseOrCourseContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrAddressContainingIgnoreCase(
                eq(""), eq(""), eq(""), eq(""), any(Pageable.class))).thenReturn(page);
        PagedResponse<StudentDto> response = studentService.keywordSearch(null, 0, 10);
        assertEquals(1, response.getContent().size());
    }

    @Test
    void findByCourse_returnsListOfDtos() {
        Student student = TestBuilders.buildStudent(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        when(studentRepository.findByCourseIgnoreCase("Math")).thenReturn(List.of(student));
        List<StudentDto> result = studentService.findByCourse("Math");
        assertEquals(1, result.size());
        assertEquals("John", result.get(0).getName());
    }

    @Test
    void count_returnsCount() {
        when(studentRepository.count()).thenReturn(5L);
        long count = studentService.count();
        assertEquals(5L, count);
    }

    @Test
    void buildPageable_invalidSortField_throwsBadRequest() {
        assertThrows(BadRequestException.class, () -> studentService.getAll(0, 10, "invalidField", "asc"));
    }

    @Test
    void buildPageable_nullSortBy_defaultsToId() {
        Student student = TestBuilders.buildStudent(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        Page<Student> page = new PageImpl<>(List.of(student));
        when(studentRepository.findAll(any(Pageable.class))).thenReturn(page);
        assertDoesNotThrow(() -> studentService.getAll(0, 10, null, "asc"));
    }

    @Test
    void buildPageable_negativePage_normalizesToDefault() {
        Student student = TestBuilders.buildStudent(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        Page<Student> page = new PageImpl<>(List.of(student));
        when(studentRepository.findAll(any(Pageable.class))).thenReturn(page);
        PagedResponse<StudentDto> response = studentService.getAll(-1, 10, "id", "asc");
        assertNotNull(response);
    }

    @Test
    void buildPageable_zeroSize_normalizesToDefault() {
        Student student = TestBuilders.buildStudent(1L, "John", "Math", "Algebra", 1000.0, "123 St", LocalDate.now());
        Page<Student> page = new PageImpl<>(List.of(student));
        when(studentRepository.findAll(any(Pageable.class))).thenReturn(page);
        PagedResponse<StudentDto> response = studentService.getAll(0, 0, "id", "asc");
        assertNotNull(response);
    }
}
