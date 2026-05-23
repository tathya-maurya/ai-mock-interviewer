package com.aiinterviewer.ai_mock_interviewer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubmitAnswerResponse {
    private int score;
    private String feedback;
    private String improvements;
    private String idealAnswer;
}