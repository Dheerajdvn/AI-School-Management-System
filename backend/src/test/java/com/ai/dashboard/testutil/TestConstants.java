package com.ai.dashboard.testutil;

/**
 * Common test constants.
 */
public final class TestConstants {

    private TestConstants() {}

    // User test data
    public static final Long TEST_USER_ID = 1L;
    public static final String TEST_USERNAME = "testuser";
    public static final String TEST_EMAIL = "test@example.com";
    public static final String TEST_PASSWORD = "password123";
    public static final String TEST_ROLE_USER = "ROLE_USER";
    public static final String TEST_ROLE_TEACHER = "ROLE_TEACHER";
    public static final String TEST_ROLE_ADMIN = "ROLE_ADMIN";

    // Course test data
    public static final Long TEST_COURSE_ID = 1L;
    public static final String TEST_COURSE_CODE = "CS101";
    public static final String TEST_COURSE_TITLE = "Introduction to Computer Science";

    // Assignment test data
    public static final Long TEST_ASSIGNMENT_ID = 1L;
    public static final String TEST_ASSIGNMENT_TITLE = "Assignment 1";

    // Document test data
    public static final Long TEST_DOCUMENT_ID = 1L;
    public static final String TEST_FILENAME = "lecture-notes.pdf";

    // Conversation test data
    public static final String TEST_SESSION_ID = "test-session-123";
    public static final String TEST_MESSAGE_CONTENT = "Test message content";
}