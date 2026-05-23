package com.aiinterviewer.ai_mock_interviewer.repository;

import com.aiinterviewer.ai_mock_interviewer.entity.QuestionAnswer;
import com.aiinterviewer.ai_mock_interviewer.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, Long> {

    List<QuestionAnswer> findByInterviewSession(InterviewSession interviewSession);
}