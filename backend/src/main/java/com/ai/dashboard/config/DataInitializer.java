package com.ai.dashboard.config;

import com.ai.dashboard.entity.Student;
import com.ai.dashboard.repository.StudentRepository;
import com.ai.dashboard.util.StudentDataFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Seeds the database with realistic synthetic student records on first start.
 *
 * <p>Triggered only when the {@code student} table is empty and the
 * {@code app.seed.enabled} flag is true (default).</p>
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private static final int BATCH = 500;

    private final StudentRepository studentRepository;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    /**
     * ApplicationRunner keeps the seeding out of the web request thread and
     * runs after the JPA context is fully initialised.
     */
    @Bean
    public ApplicationRunner seedDatabase() {
        return args -> {
            if (!seedEnabled) {
                log.info("Data seeding disabled (app.seed.enabled=false)");
                return;
            }
            long existing = studentRepository.count();
            if (existing > 0) {
                log.info("Student table already has {} records — skipping seed.", existing);
                return;
            }
            seedStudents();
        };
    }

    @Transactional
    protected void seedStudents() {
        log.info("Seeding student table with 10,000 records...");
        long start = System.currentTimeMillis();
        List<Student> buffer = new ArrayList<>(BATCH);
        for (int i = 0; i < 10_000; i++) {
            buffer.add(StudentDataFactory.randomStudent());
            if (buffer.size() == BATCH) {
                studentRepository.saveAll(buffer);
                buffer.clear();
            }
        }
        if (!buffer.isEmpty()) {
            studentRepository.saveAll(buffer);
        }
        long elapsed = System.currentTimeMillis() - start;
        log.info("Seeding complete — 10,000 students inserted in {} ms.", elapsed);
    }
}
