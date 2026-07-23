package com.ai.dashboard.testutil;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;

public class MockMvcUtils {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String jsonPost(String url, Object body) throws Exception {
        return objectMapper.writeValueAsString(body);
    }

    public static String jsonPut(String url, Object body) throws Exception {
        return objectMapper.writeValueAsString(body);
    }
}