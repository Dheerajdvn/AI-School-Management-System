package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.PagedResponse;
import com.ai.dashboard.dto.StudentDto;
import com.ai.dashboard.entity.Student;
import com.ai.dashboard.exception.BadRequestException;
import com.ai.dashboard.exception.ResourceNotFoundException;
import com.ai.dashboard.repository.StudentRepository;
import com.ai.dashboard.repository.StudentSpecifications;
import com.ai.dashboard.service.StudentService;
import com.ai.dashboard.util.AppConstants;
import com.ai.dashboard.util.StudentMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Default implementation of {@link StudentService}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    /** Whitelisted sort fields to avoid JPA ordering by arbitrary expressions. */
    private static final List<String> SORTABLE = List.of(
            "id", "name", "course", "subject", "fee", "address", "joiningDate", "createdAt");

    private final StudentRepository studentRepository;

    @Override
    @Transactional
    public StudentDto create(StudentDto dto) {
        log.debug("Creating student: {}", dto.getName());
        Student saved = studentRepository.save(StudentMapper.toEntity(dto));
        return StudentMapper.toDto(saved);
    }

    @Override
    @Transactional
    public StudentDto update(Long id, StudentDto dto) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + id));
        StudentMapper.merge(dto, existing);
        Student saved = studentRepository.save(existing);
        log.debug("Updated student id={}", id);
        return StudentMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDto getById(Long id) {
        return studentRepository.findById(id)
                .map(StudentMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + id));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id " + id);
        }
        studentRepository.deleteById(id);
        log.debug("Deleted student id={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<StudentDto> getAll(int page, int size, String sortBy, String direction) {
        Pageable pageable = buildPageable(page, size, sortBy, direction);
        Page<Student> result = studentRepository.findAll(pageable);
        return toPaged(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<StudentDto> search(String name, String course, String subject, String city,
                                            Double minFee, Double maxFee,
                                            LocalDate joiningFrom, LocalDate joiningTo,
                                            int page, int size, String sortBy, String direction) {
        Specification<Student> spec = Specification
                .allOf(
                        StudentSpecifications.nameContains(name),
                        StudentSpecifications.courseEquals(course),
                        StudentSpecifications.subjectEquals(subject),
                        StudentSpecifications.cityEquals(city),
                        StudentSpecifications.feeBetween(minFee, maxFee),
                        StudentSpecifications.joiningDateBetween(joiningFrom, joiningTo));

        Pageable pageable = buildPageable(page, size, sortBy, direction);
        Page<Student> result = studentRepository.findAll(spec, pageable);
        return toPaged(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<StudentDto> keywordSearch(String keyword, int page, int size) {
        String kw = (keyword == null) ? "" : keyword;
        Pageable pageable = PageRequest.of(normalisePage(page), normaliseSize(size));
        Page<Student> result = studentRepository
                .findByNameContainingIgnoreCaseOrCourseContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrAddressContainingIgnoreCase(
                        kw, kw, kw, kw, pageable);
        return toPaged(result);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDto> findByCourse(String course) {
        return studentRepository.findByCourseIgnoreCase(course).stream()
                .map(StudentMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return studentRepository.count();
    }


    private Pageable buildPageable(int page, int size, String sortBy, String direction) {
        int p = normalisePage(page);
        int s = normaliseSize(size);
        String field = (sortBy == null || sortBy.isBlank()) ? "id" : sortBy;
        if (!SORTABLE.contains(field)) {
            throw new BadRequestException("Sorting by '" + field + "' is not allowed");
        }
        Sort.Direction dir = AppConstants.SORT_DESC.equalsIgnoreCase(direction)
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageRequest.of(p, s, Sort.by(dir, field));
    }

    private int normalisePage(int page) {
        return Math.max(page, AppConstants.DEFAULT_PAGE);
    }

    private int normaliseSize(int size) {
        if (size <= 0) return AppConstants.DEFAULT_SIZE;
        return Math.min(size, AppConstants.MAX_SIZE);
    }

    private PagedResponse<StudentDto> toPaged(Page<Student> result) {
        return PagedResponse.<StudentDto>builder()
                .content(result.getContent().stream().map(StudentMapper::toDto).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }
}
