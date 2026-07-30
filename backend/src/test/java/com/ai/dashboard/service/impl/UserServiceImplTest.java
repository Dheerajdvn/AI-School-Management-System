package com.ai.dashboard.service.impl;

import com.ai.dashboard.dto.CreateUserRequest;
import com.ai.dashboard.dto.UpdateUserRequest;
import com.ai.dashboard.dto.UserDto;
import com.ai.dashboard.entity.Role;
import com.ai.dashboard.entity.User;
import com.ai.dashboard.repository.RoleRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.service.UserService;
import com.ai.dashboard.testutil.TestBuilders;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void listUsers_returnsPagedUserDtos() {
        User user = TestBuilders.buildUser(1L, "john", "john@example.com", "ROLE_USER");
        when(userRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(java.util.List.of(user)));
        var result = userService.listUsers(null, null, Pageable.unpaged());
        assertEquals(1, result.getTotalElements());
        assertEquals("john", result.getContent().get(0).getUsername());
    }

    @Test
    void getUser_existingId_returnsUserDto() {
        User user = TestBuilders.buildUser(1L, "john", "john@example.com", "ROLE_USER");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        UserDto dto = userService.getUser(1L);
        assertEquals("john", dto.getUsername());
    }

    @Test
    void getUser_nonExistingId_throwsException() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> userService.getUser(999L));
    }

    @Test
    void createUser_success_returnsUserDto() {
        CreateUserRequest request = TestBuilders.buildCreateUserRequest("newuser", "new@example.com", "pass", Set.of("ROLE_USER"));
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("encodedPass");
        User savedUser = TestBuilders.buildUser(1L, "newuser", "new@example.com", "ROLE_USER");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        UserDto dto = userService.createUser(request);
        assertEquals("newuser", dto.getUsername());
    }

    @Test
    void createUser_duplicateUsername_throwsException() {
        CreateUserRequest request = TestBuilders.buildCreateUserRequest("existing", "new@example.com", "pass", Set.of("ROLE_USER"));
        when(userRepository.existsByUsername("existing")).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> userService.createUser(request));
    }

    @Test
    void createUser_duplicateEmail_throwsException() {
        CreateUserRequest request = TestBuilders.buildCreateUserRequest("newuser", "existing@example.com", "pass", Set.of("ROLE_USER"));
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> userService.createUser(request));
    }

    @Test
    void updateUser_success_returnsUpdatedUserDto() {
        User existing = TestBuilders.buildUser(1L, "oldname", "old@example.com", "ROLE_USER");
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.existsByUsername("newname")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        UpdateUserRequest request = TestBuilders.buildUpdateUserRequest("newname", "new@example.com", null, Set.of("ROLE_USER"), true);
        UserDto dto = userService.updateUser(1L, request);
        assertEquals("newname", dto.getUsername());
        assertEquals("new@example.com", dto.getEmail());
    }

    @Test
    void updateUser_duplicateUsername_throwsException() {
        User existing = TestBuilders.buildUser(1L, "oldname", "old@example.com", "ROLE_USER");
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.existsByUsername("existingname")).thenReturn(true);
        UpdateUserRequest request = TestBuilders.buildUpdateUserRequest("existingname", "old@example.com", null, Set.of("ROLE_USER"), true);
        assertThrows(IllegalArgumentException.class, () -> userService.updateUser(1L, request));
    }

    @Test
    void updateUser_nonExistingId_throwsException() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        UpdateUserRequest request = TestBuilders.buildUpdateUserRequest("newname", "new@example.com", null, Set.of("ROLE_USER"), true);
        assertThrows(IllegalArgumentException.class, () -> userService.updateUser(999L, request));
    }

    @Test
    void deleteUser_existingId_deletesUser() {
        User user = TestBuilders.buildUser(1L, "user1", "user1@example.com", "ROLE_USER");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        doNothing().when(userRepository).deleteById(1L);
        assertDoesNotThrow(() -> userService.deleteUser(1L));
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void setEnabled_existingId_updatesEnabled() {
        User user = TestBuilders.buildUser(1L, "john", "john@example.com", "ROLE_USER");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        UserDto dto = userService.setEnabled(1L, false);
        assertFalse(dto.isEnabled());
    }

    @Test
    void setEnabled_nonExistingId_throwsException() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> userService.setEnabled(999L, true));
    }

    @Test
    void resetPassword_existingId_updatesPassword() {
        User user = TestBuilders.buildUser(1L, "john", "john@example.com", "ROLE_USER");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newpass")).thenReturn("encodedNewPass");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        assertDoesNotThrow(() -> userService.resetPassword(1L, "newpass"));
        verify(passwordEncoder, times(1)).encode("newpass");
    }

    @Test
    void resetPassword_nonExistingId_throwsException() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> userService.resetPassword(999L, "newpass"));
    }
}
