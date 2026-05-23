package com.aiinterviewer.ai_mock_interviewer.dto;

import com.aiinterviewer.ai_mock_interviewer.entity.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewSessionResponse {
    private Long id;
    private String interviewTopic;
    private String scheduledDate;
    private InterviewStatus status;
    private int questionsAttempted;
}

