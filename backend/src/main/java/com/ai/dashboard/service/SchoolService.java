package com.ai.dashboard.service;

import com.ai.dashboard.dto.*;

public interface SchoolService {
    PagedResponse<SchoolDto> getAllSchools(int page, int size, String search, String status, String sortBy, String direction);
    SchoolDto getSchoolById(Long id);
    SchoolCreateResponse createSchool(SchoolCreateRequest request);
    SchoolDto updateSchool(Long id, SchoolUpdateRequest request);
    void deleteSchool(Long id);
    SchoolDto toggleStatus(Long id);
}
