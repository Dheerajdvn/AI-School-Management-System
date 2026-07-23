package com.ai.dashboard.service;

import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.dto.StudentDto;

import java.time.LocalDate;
import java.util.List;

/**
 * Contract for student CRUD + search operations.
 */
public interface StudentService {

    StudentDto create(StudentDto dto);

    StudentDto update(Long id, StudentDto dto);

    StudentDto getById(Long id);

    void delete(Long id);

    PagedResponse<StudentDto> getAll(int page, int size, String sortBy, String direction);

    /**
     * Dynamic filtered search across multiple optional fields with paging/sorting.
     */
    PagedResponse<StudentDto> search(String name, String course, String subject, String city,
                                     Double minFee, Double maxFee,
                                     LocalDate joiningFrom, LocalDate joiningTo,
                                     int page, int size, String sortBy, String direction);

    /**
     * Plain keyword search across name/course/subject/city.
     */
    PagedResponse<StudentDto> keywordSearch(String keyword, int page, int size);

    List<StudentDto> findByCourse(String course);

    long count();
}
