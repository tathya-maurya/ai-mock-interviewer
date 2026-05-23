package com.aiinterviewer.ai_mock_interviewer.controller;

import com.aiinterviewer.ai_mock_interviewer.dto.*;
import com.aiinterviewer.ai_mock_interviewer.entity.QuestionAnswer;
import com.aiinterviewer.ai_mock_interviewer.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/interview")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/schedule")
    public ResponseEntity<InterviewSessionResponse> schedule(
            @RequestBody ScheduleInterviewRequest request) {
        return ResponseEntity.ok(interviewService.scheduleInterview(request));
    }

    @GetMapping("/start/{id}")
    public ResponseEntity<List<QuestionAnswer>> start(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.startInterview(id));
    }

    @PostMapping("/submit-answer")
    public ResponseEntity<SubmitAnswerResponse> submitAnswer(
            @RequestBody SubmitAnswerRequest request) {
        return ResponseEntity.ok(interviewService.submitAnswer(request));
    }

    @GetMapping("/{id}/score")
    public ResponseEntity<ScoreResponse> getScore(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getScore(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<InterviewSessionResponse>> getAll() {
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @GetMapping("/resume/{id}")
    public ResponseEntity<List<QuestionAnswer>> resume(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.resumeInterview(id));
    }
}
