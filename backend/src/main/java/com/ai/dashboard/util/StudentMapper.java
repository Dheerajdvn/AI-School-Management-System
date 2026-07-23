package com.ai.dashboard.util;

import com.ai.dashboard.dto.StudentDto;
import com.ai.dashboard.entity.Student;

/**
 * Maps between {@link Student} entities and {@link StudentDto} payloads.
 *
 * <p>Kept stateless and static so it is easy to test in isolation.</p>
 */
public final class StudentMapper {

    private StudentMapper() {}

    public static StudentDto toDto(Student s) {
        if (s == null) return null;
        return StudentDto.builder()
                .id(s.getId())
                .name(s.getName())
                .course(s.getCourse())
                .subject(s.getSubject())
                .fee(s.getFee())
                .address(s.getAddress())
                .joiningDate(s.getJoiningDate())
                .build();
    }

    public static Student toEntity(StudentDto dto) {
        if (dto == null) return null;
        return Student.builder()
                .id(dto.getId())
                .name(dto.getName())
                .course(dto.getCourse())
                .subject(dto.getSubject())
                .fee(dto.getFee())
                .address(dto.getAddress())
                .joiningDate(dto.getJoiningDate())
                .build();
    }

    /** Copy mutable fields from dto onto an existing entity (for updates). */
    public static void merge(StudentDto dto, Student entity) {
        if (dto.getName() != null) entity.setName(dto.getName());
        if (dto.getCourse() != null) entity.setCourse(dto.getCourse());
        if (dto.getSubject() != null) entity.setSubject(dto.getSubject());
        if (dto.getFee() != null) entity.setFee(dto.getFee());
        if (dto.getAddress() != null) entity.setAddress(dto.getAddress());
        if (dto.getJoiningDate() != null) entity.setJoiningDate(dto.getJoiningDate());
    }
}
