package com.ai.dashboard.controller;

import com.ai.dashboard.config.LoggingFilter;
import com.ai.dashboard.config.RateLimitingFilter;
import com.ai.dashboard.dto.UpdateUserRequest;
import com.ai.dashboard.dto.UserDto;
import com.ai.dashboard.entity.Role;
import com.ai.dashboard.exception.GlobalExceptionHandler;
import com.ai.dashboard.repository.RoleRepository;
import com.ai.dashboard.repository.UserRepository;
import com.ai.dashboard.security.JwtAuthenticationFilter;
import com.ai.dashboard.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Authorization tests for {@link UserController}, focused on the privilege-escalation path.
 *
 * <p>{@code PUT /users/{id}} is only guarded by {@code @PreAuthorize("isAuthenticated()")} because any
 * user must be able to save their own profile. That makes the controller's privilege-field stripping
 * the only thing standing between a student and {@code ROLE_SUPER_ADMIN}, so it is asserted here at the
 * HTTP layer — a service-level test would not prove that the JSON {@code roles} field even binds.</p>
 */
@WebMvcTest(
        controllers = UserController.class,
        // These @Component filters are swept into the MVC slice and drag in Redis / JWT collaborators
        // that this test has no use for. Boot's default security chain still authenticates the request.
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = { RateLimitingFilter.class, LoggingFilter.class, JwtAuthenticationFilter.class }))
@Import({ UserControllerAuthorizationTest.MethodSecurityTestConfig.class, GlobalExceptionHandler.class })
@ActiveProfiles("test")
class UserControllerAuthorizationTest {

    /**
     * {@code @WebMvcTest} does not pick up the application's {@code SecurityConfig} (it needs the JWT
     * filter and its collaborators), so the parts that matter are recreated here. Without
     * {@code @EnableMethodSecurity} the {@code @PreAuthorize} annotations are silently inert and every
     * role assertion below would pass vacuously; without the filter chain, Boot's default enables CSRF
     * and every mutating request would 403 regardless of the caller's roles.
     */
    @TestConfiguration
    @EnableMethodSecurity(prePostEnabled = true)
    static class MethodSecurityTestConfig {

        @Bean
        SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
            http
                    .csrf(AbstractHttpConfigurer::disable)
                    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .authorizeHttpRequests(auth -> auth.anyRequest().authenticated());
            return http.build();
        }
    }

    private static final long STUDENT_ID = 7L;
    private static final long OTHER_USER_ID = 99L;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private RoleRepository roleRepository;

    @MockBean
    private UserRepository userRepository;

    /**
     * Mirrors {@code JwtAuthenticationFilter}: principal is the {@link UserDetails}, credentials is the
     * user id, which is what {@code UserController.extractUserId} reads for the self-access check.
     */
    private static Authentication authFor(long userId, String username, String... authorities) {
        List<SimpleGrantedAuthority> granted = Arrays.stream(authorities)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        UserDetails principal = org.springframework.security.core.userdetails.User.builder()
                .username(username)
                .password("irrelevant")
                .authorities(granted)
                .build();
        return new UsernamePasswordAuthenticationToken(principal, userId, granted);
    }

    private static String updateBody(String extraJson) {
        String base = "\"username\":\"student7\",\"email\":\"student7@example.com\"";
        return "{" + base + (extraJson.isEmpty() ? "" : "," + extraJson) + "}";
    }

    private UpdateUserRequest captureUpdate(long id) {
        ArgumentCaptor<UpdateUserRequest> captor = ArgumentCaptor.forClass(UpdateUserRequest.class);
        verify(userService).updateUser(eq(id), captor.capture());
        return captor.getValue();
    }

    // ---------------------------------------------------------------------
    // The escalation path
    // ---------------------------------------------------------------------

    @Test
    void nonAdminUpdatingOwnProfileCannotGrantItselfRoles() throws Exception {
        when(userService.updateUser(eq(STUDENT_ID), any(UpdateUserRequest.class))).thenReturn(new UserDto());

        mockMvc.perform(put("/users/{id}", STUDENT_ID)
                        .with(authentication(authFor(STUDENT_ID, "student7", "ROLE_STUDENT")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody("\"roles\":[\"ROLE_SUPER_ADMIN\"]")))
                .andExpect(status().isOk());

        assertThat(captureUpdate(STUDENT_ID).getRoles())
                .as("submitted roles must be discarded for a non-admin caller")
                .isNull();
    }

    @Test
    void nonAdminUpdatingOwnProfileCannotChangeEnabledFlag() throws Exception {
        when(userService.updateUser(eq(STUDENT_ID), any(UpdateUserRequest.class))).thenReturn(new UserDto());

        mockMvc.perform(put("/users/{id}", STUDENT_ID)
                        .with(authentication(authFor(STUDENT_ID, "student7", "ROLE_STUDENT")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody("\"enabled\":false")))
                .andExpect(status().isOk());

        assertThat(captureUpdate(STUDENT_ID).getEnabled())
                .as("submitted enabled flag must be discarded for a non-admin caller")
                .isNull();
    }

    @Test
    void teacherCannotGrantItselfRolesEither() throws Exception {
        when(userService.updateUser(eq(STUDENT_ID), any(UpdateUserRequest.class))).thenReturn(new UserDto());

        mockMvc.perform(put("/users/{id}", STUDENT_ID)
                        .with(authentication(authFor(STUDENT_ID, "teacher7", "ROLE_TEACHER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody("\"roles\":[\"ROLE_ADMIN\"]")))
                .andExpect(status().isOk());

        assertThat(captureUpdate(STUDENT_ID).getRoles()).isNull();
    }

    @Test
    void nonAdminProfileFieldsStillReachTheService() throws Exception {
        when(userService.updateUser(eq(STUDENT_ID), any(UpdateUserRequest.class))).thenReturn(new UserDto());

        mockMvc.perform(put("/users/{id}", STUDENT_ID)
                        .with(authentication(authFor(STUDENT_ID, "student7", "ROLE_STUDENT")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody("\"firstName\":\"Renamed\",\"roles\":[\"ROLE_ADMIN\"]")))
                .andExpect(status().isOk());

        UpdateUserRequest captured = captureUpdate(STUDENT_ID);
        assertThat(captured.getFirstName())
                .as("stripping privilege fields must not break ordinary profile edits")
                .isEqualTo("Renamed");
        assertThat(captured.getRoles()).isNull();
    }

    // ---------------------------------------------------------------------
    // Admins must keep working: the admin UserForm sends roles on PUT
    // ---------------------------------------------------------------------

    @Test
    void adminCanStillSetRolesOnUpdate() throws Exception {
        when(userService.updateUser(eq(OTHER_USER_ID), any(UpdateUserRequest.class))).thenReturn(new UserDto());

        mockMvc.perform(put("/users/{id}", OTHER_USER_ID)
                        .with(authentication(authFor(1L, "admin", "ROLE_ADMIN")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody("\"roles\":[\"ROLE_TEACHER\"],\"enabled\":false")))
                .andExpect(status().isOk());

        UpdateUserRequest captured = captureUpdate(OTHER_USER_ID);
        assertThat(captured.getRoles()).containsExactly("ROLE_TEACHER");
        assertThat(captured.getEnabled()).isFalse();
    }

    @Test
    void superAdminCanStillSetRolesOnUpdate() throws Exception {
        when(userService.updateUser(eq(OTHER_USER_ID), any(UpdateUserRequest.class))).thenReturn(new UserDto());

        mockMvc.perform(put("/users/{id}", OTHER_USER_ID)
                        .with(authentication(authFor(1L, "root", "ROLE_SUPER_ADMIN")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody("\"roles\":[\"ROLE_PRINCIPAL\"]")))
                .andExpect(status().isOk());

        assertThat(captureUpdate(OTHER_USER_ID).getRoles()).containsExactly("ROLE_PRINCIPAL");
    }

    // ---------------------------------------------------------------------
    // Cross-user access
    // ---------------------------------------------------------------------

    @Test
    void nonAdminCannotUpdateAnotherUser() throws Exception {
        mockMvc.perform(put("/users/{id}", OTHER_USER_ID)
                        .with(authentication(authFor(STUDENT_ID, "student7", "ROLE_STUDENT")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody("")))
                .andExpect(status().isForbidden());

        verify(userService, never()).updateUser(any(Long.class), any(UpdateUserRequest.class));
    }

    @Test
    void nonAdminCannotReadAnotherUser() throws Exception {
        mockMvc.perform(get("/users/{id}", OTHER_USER_ID)
                        .with(authentication(authFor(STUDENT_ID, "student7", "ROLE_STUDENT"))))
                .andExpect(status().isForbidden());

        verify(userService, never()).getUser(any(Long.class));
    }

    // ---------------------------------------------------------------------
    // Admin-only endpoints stay admin-only
    // ---------------------------------------------------------------------

    @Test
    void nonAdminCannotListUsers() throws Exception {
        mockMvc.perform(get("/users")
                        .with(authentication(authFor(STUDENT_ID, "student7", "ROLE_STUDENT"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void nonAdminCannotUseTheRolesEndpoint() throws Exception {
        mockMvc.perform(post("/users/{id}/roles", STUDENT_ID)
                        .with(authentication(authFor(STUDENT_ID, "student7", "ROLE_STUDENT")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[\"ROLE_SUPER_ADMIN\"]"))
                .andExpect(status().isForbidden());

        verify(userService, never()).updateUser(any(Long.class), any(UpdateUserRequest.class));
    }

    @Test
    void nonAdminCannotDeleteAUser() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .delete("/users/{id}", OTHER_USER_ID)
                        .with(authentication(authFor(STUDENT_ID, "student7", "ROLE_STUDENT"))))
                .andExpect(status().isForbidden());

        verify(userService, never()).deleteUser(any(Long.class));
    }

    @Test
    void adminSettingAnUnknownRoleIsRejected() throws Exception {
        when(roleRepository.findByName("ROLE_MADE_UP")).thenReturn(Optional.empty());

        mockMvc.perform(post("/users/{id}/roles", OTHER_USER_ID)
                        .with(authentication(authFor(1L, "admin", "ROLE_ADMIN")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[\"ROLE_MADE_UP\"]"))
                .andExpect(status().isBadRequest());

        verify(userService, never()).updateUser(any(Long.class), any(UpdateUserRequest.class));
    }

    @Test
    void adminSettingAKnownRoleSucceeds() throws Exception {
        when(roleRepository.findByName("ROLE_TEACHER"))
                .thenReturn(Optional.of(Role.builder().name("ROLE_TEACHER").build()));
        UserDto existing = new UserDto();
        existing.setUsername("target");
        existing.setEmail("target@example.com");
        when(userService.getUser(OTHER_USER_ID)).thenReturn(existing);
        when(userService.updateUser(eq(OTHER_USER_ID), any(UpdateUserRequest.class))).thenReturn(existing);

        mockMvc.perform(post("/users/{id}/roles", OTHER_USER_ID)
                        .with(authentication(authFor(1L, "admin", "ROLE_ADMIN")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[\"ROLE_TEACHER\"]"))
                .andExpect(status().isOk());

        assertThat(captureUpdate(OTHER_USER_ID).getRoles()).isEqualTo(Set.of("ROLE_TEACHER"));
    }
}
