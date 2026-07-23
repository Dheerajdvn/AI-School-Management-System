package com.ai.dashboard.ai.prompt;

import org.springframework.stereotype.Component;

/**
 * Prompt template for AI Lesson Planner functionality.
 */
@Component
public class LessonPlannerPromptTemplate implements PromptTemplate {

    private static final String SYSTEM_TEMPLATE = """
            You are an AI Lesson Planner. Create structured, engaging lesson plans.
            
            Guidelines:
            1. Include clear learning objectives
            2. Structure with introduction, main content, activities, and assessment
            3. Provide time estimates for each section
            4. Include interactive elements and examples
            5. Consider different learning styles
            6. Suggest relevant materials and resources
            """;

    private static final String PLAN_TEMPLATE = """
            Subject: {subject}
            Topic: {topic}
            Duration: {duration} minutes
            Student Level: {level}
            
            Context from Course Materials:
            {context}
            
            Please create a comprehensive lesson plan including:
            1. Learning objectives
            2. Introduction/Hook (5-10 minutes)
            3. Main content with examples (60% of time)
            4. Interactive activities (20% of time)
            5. Assessment/Review (10% of time)
            6. Suggested materials and resources
            """;

    @Override
    public PromptType getType() {
        return PromptType.LESSON_PLANNER;
    }

    @Override
    public String buildSystemPrompt() {
        return SYSTEM_TEMPLATE;
    }

    @Override
    public String buildUserPrompt(PromptBuildRequest request) {
        Integer duration = request.intVariable("duration");
        return buildLessonPlanPrompt(
                request.stringVariable("subject"),
                request.stringVariable("topic"),
                duration != null ? duration : 60,
                request.stringVariable("level"),
                request.context());
    }

    public String buildLessonPlanPrompt(String subject, String topic, int duration, String level, String context) {
        return PLAN_TEMPLATE
                .replace("{subject}", subject != null ? subject : "General")
                .replace("{topic}", topic != null ? topic : "Lesson Topic")
                .replace("{duration}", String.valueOf(duration))
                .replace("{level}", level != null ? level : "Intermediate")
                .replace("{context}", context != null && !context.isEmpty() ? context : "No specific context provided");
    }
}
