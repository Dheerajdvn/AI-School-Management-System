package com.ai.dashboard.util;

import com.ai.dashboard.entity.Student;

import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Utility that generates realistic but synthetic student records.
 *
 * <p>Used by {@code DataInitializer} to seed the database on first start.</p>
 */
public final class StudentDataFactory {

    private StudentDataFactory() {}

    public static final List<String> FIRST_NAMES = List.of(
            "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan",
            "Krishna", "Ishaan", "Rohan", "Karan", "Rahul", "Amit", "Suresh", "Dinesh",
            "Ananya", "Diya", "Saanvi", "Aadhya", "Aaradhya", "Pari", "Riya", "Sneha",
            "Priya", "Kavya", "Neha", "Pooja", "Meera", "Ira", "Myra", "Anika",
            "Rahul", "Siddharth", "Harsh", "Nikhil", "Manish", "Ravi", "Akash", "Varun"
    );

    public static final List<String> LAST_NAMES = List.of(
            "Sharma", "Verma", "Gupta", "Patel", "Reddy", "Naidu", "Rao", "Iyer",
            "Nair", "Singh", "Khan", "Joshi", "Mehta", "Agarwal", "Bose", "Das",
            "Mishra", "Yadav", "Pillai", "Menon", "Kapoor", "Malhotra", "Chopra", "Bhat"
    );

    public static final List<String> COURSES = List.of(
            "Java", "Python", "React", "Angular", "Node.js", "AWS", "DevOps",
            "Data Science", "Machine Learning", "Spring Boot", "Flutter", "MongoDB"
    );

    public static final List<String> SUBJECTS = List.of(
            "Core Fundamentals", "Advanced Programming", "Spring Boot", "Django",
            "REST APIs", "Microservices", "Cloud Computing", "Deep Learning",
            "JavaScript", "TypeScript", "Docker & Kubernetes", "Database Design"
    );

    public static final List<String> CITIES = List.of(
            "Hyderabad", "Pune", "Delhi", "Mumbai", "Bengaluru", "Chennai",
            "Kolkata", "Jaipur", "Ahmedabad", "Indore", "Lucknow", "Surat"
    );

    public static final double MIN_FEE = 5000.0;
    public static final double MAX_FEE = 60000.0;

    /**
     * Create one random student. The id is left null so JPA assigns it.
     */
    public static Student randomStudent() {
        Random rnd = ThreadLocalRandom.current();
        String name = pick(FIRST_NAMES, rnd) + " " + pick(LAST_NAMES, rnd);
        String course = pick(COURSES, rnd);
        String subject = pick(SUBJECTS, rnd);
        String city = pick(CITIES, rnd);
        double fee = round(MIN_FEE + rnd.nextDouble() * (MAX_FEE - MIN_FEE));
        LocalDate joiningDate = randomJoiningDate(rnd);

        return Student.builder()
                .name(name)
                .course(course)
                .subject(subject)
                .fee(fee)
                .address(city)
                .joiningDate(joiningDate)
                .build();
    }

    private static LocalDate randomJoiningDate(Random rnd) {
        // Spread joining dates across 2022-01-01 .. today.
        LocalDate start = LocalDate.of(2022, Month.JANUARY, 1);
        LocalDate end = LocalDate.now();
        long days = ChronoUnit.DAYS.between(start, end);
        return start.plusDays(rnd.nextInt((int) Math.max(1, days + 1)));
    }

    private static <T> T pick(List<T> list, Random rnd) {
        return list.get(rnd.nextInt(list.size()));
    }

    private static double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
