package com.aiinterviewer.ai_mock_interviewer.repository;

import com.aiinterviewer.ai_mock_interviewer.entity.InterviewSession;
import com.aiinterviewer.ai_mock_interviewer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {

    // Count sessions in last 7 days for restriction check
    @Query("SELECT COUNT(s) FROM InterviewSession s WHERE s.user = :user AND s.scheduledDate >= :sevenDaysAgo")
    int countSessionsInLast7Days(@Param("user") User user, @Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    // Get all sessions for a user
    List<InterviewSession> findByUserOrderByScheduledDateDesc(User user);
}