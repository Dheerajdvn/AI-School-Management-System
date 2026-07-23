package com.ai.dashboard.service;

import com.ai.dashboard.dto.CreateUserRequest;
import com.ai.dashboard.dto.UpdateUserRequest;
import com.ai.dashboard.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserDto> listUsers(String q, String role, Pageable pageable);
    UserDto getUser(Long id);
    UserDto createUser(CreateUserRequest request);
    UserDto updateUser(Long id, UpdateUserRequest request);
    void deleteUser(Long id);
    UserDto setEnabled(Long id, boolean enabled);
    void resetPassword(Long id, String newPassword);
}
