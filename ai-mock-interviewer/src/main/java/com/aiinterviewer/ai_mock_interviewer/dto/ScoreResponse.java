package com.aiinterviewer.ai_mock_interviewer.dto;

import com.aiinterviewer.ai_mock_interviewer.entity.QuestionAnswer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScoreResponse {
    private Long sessionId;
    private String interviewTopic;
    private double averageScore;
    private int totalQuestions;
    private int questionsAttempted;
    private List<QuestionAnswer> questionAnswers;
}