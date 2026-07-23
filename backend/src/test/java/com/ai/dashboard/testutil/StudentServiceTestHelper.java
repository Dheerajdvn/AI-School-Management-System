package com.ai.dashboard.testutil;

import com.ai.dashboard.entity.*;
import com.ai.dashboard.service.StudentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class StudentServiceTestHelper {

    public static Page<Student> buildStudentPage(List<Student> students, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), students.size());
        List<Student> subList = students.subList(start, end);
        return new PageImpl<>(subList, pageable, students.size());
    }

    public static Page<Student> buildEmptyStudentPage(Pageable pageable) {
        return new PageImpl<>(List.of(), pageable, 0);
    }
}
