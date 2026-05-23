package com.aiinterviewer.ai_mock_interviewer.service;

import com.aiinterviewer.ai_mock_interviewer.dto.*;
import com.aiinterviewer.ai_mock_interviewer.entity.*;
import com.aiinterviewer.ai_mock_interviewer.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewSessionRepository interviewSessionRepository;
    private final QuestionAnswerRepository questionAnswerRepository;
    private final UserRepository userRepository;
    private final OpenAiService openAiService;

    // Get logged in user from JWT token
    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Schedule interview
    public InterviewSessionResponse scheduleInterview(ScheduleInterviewRequest request) {
        User user = getLoggedInUser();

        // Check 7 day restriction
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        int count = interviewSessionRepository.countSessionsInLast7Days(user, sevenDaysAgo);
        if (count >= 3) {
            throw new RuntimeException("Weekly limit reached. You can only schedule 3 interviews per week.");
        }

        // Create and save session
        InterviewSession session = InterviewSession.builder()
                .interviewTopic(request.getInterviewTopic())
                .scheduledDate(LocalDateTime.now())
                .status(InterviewStatus.SCHEDULED)
                .questionsAttempted(0)
                .user(user)
                .build();

        interviewSessionRepository.save(session);

        return mapToResponse(session);
    }

    // Start interview and generate questions via OpenAI
    public List<QuestionAnswer> startInterview(Long sessionId) {
        User user = getLoggedInUser();

        InterviewSession session = interviewSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Generate questions via OpenAI
        List<String> questions = openAiService.generateQuestions(session.getInterviewTopic());

        // Save questions to database
        List<QuestionAnswer> questionAnswers = questions.stream()
                .map(q -> QuestionAnswer.builder()
                        .question(q)
                        .interviewSession(session)
                        .build())
                .collect(Collectors.toList());

        questionAnswerRepository.saveAll(questionAnswers);

        // Update session status
        session.setStatus(InterviewStatus.IN_PROGRESS);
        interviewSessionRepository.save(session);

        return questionAnswers;
    }

    // Submit answer and get AI evaluation
    public SubmitAnswerResponse submitAnswer(SubmitAnswerRequest request) {
        QuestionAnswer qa = questionAnswerRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Save answer
        qa.setAnswer(request.getAnswer());

        // Get AI evaluation
        SubmitAnswerResponse evaluation = openAiService.evaluateAnswer(
                qa.getQuestion(), request.getAnswer());

        // Save score and feedback
        qa.setScore(evaluation.getScore());
        qa.setAiFeedback(evaluation.getFeedback());
        qa.setImprovements(evaluation.getImprovements());
        qa.setIdealAnswer(evaluation.getIdealAnswer());
        questionAnswerRepository.save(qa);

        // Increment questions attempted
        InterviewSession session = qa.getInterviewSession();
        session.setQuestionsAttempted(session.getQuestionsAttempted() + 1);

        // Check if all questions answered
        List<QuestionAnswer> allQuestions = questionAnswerRepository
                .findByInterviewSession(session);
        boolean allAnswered = allQuestions.stream()
                .allMatch(q -> q.getAnswer() != null);
        if (allAnswered) {
            session.setStatus(InterviewStatus.COMPLETED);
        }

        interviewSessionRepository.save(session);
        return evaluation;
    }

    // Get score for a session
    public ScoreResponse getScore(Long sessionId) {
        InterviewSession session = interviewSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        List<QuestionAnswer> answers = questionAnswerRepository
                .findByInterviewSession(session);

        double averageScore = answers.stream()
                .filter(qa -> qa.getScore() != null)
                .mapToInt(QuestionAnswer::getScore)
                .average()
                .orElse(0.0);

        return ScoreResponse.builder()
                .sessionId(sessionId)
                .interviewTopic(session.getInterviewTopic())
                .averageScore(averageScore)
                .totalQuestions(answers.size())
                .questionsAttempted(session.getQuestionsAttempted())
                .questionAnswers(answers)
                .build();
    }

    // Get all past interviews
    public List<InterviewSessionResponse> getAllInterviews() {
        User user = getLoggedInUser();
        return interviewSessionRepository.findByUserOrderByScheduledDateDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Resume interview
    public List<QuestionAnswer> resumeInterview(Long sessionId) {
        InterviewSession session = interviewSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        return questionAnswerRepository.findByInterviewSession(session);
    }

    // Map entity to response DTO
    private InterviewSessionResponse mapToResponse(InterviewSession session) {
        return InterviewSessionResponse.builder()
                .id(session.getId())
                .interviewTopic(session.getInterviewTopic())
                .scheduledDate(session.getScheduledDate().toString())
                .status(session.getStatus())
                .questionsAttempted(session.getQuestionsAttempted())
                .build();
    }
}

