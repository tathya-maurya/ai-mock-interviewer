package com.aiinterviewer.ai_mock_interviewer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitAnswerRequest {
    private Long questionId;
    private String answer;
}