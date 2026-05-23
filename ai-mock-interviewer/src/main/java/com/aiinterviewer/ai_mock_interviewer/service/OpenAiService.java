package com.aiinterviewer.ai_mock_interviewer.service;

import com.aiinterviewer.ai_mock_interviewer.dto.SubmitAnswerResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OpenAiService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Only these two lines change from OpenAI
    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama-3.3-70b-versatile";

    public List<String> generateQuestions(String topic) {
        String prompt = String.format(
                "Generate exactly 10 technical interview questions for a %s position. " +
                        "Return ONLY a JSON array of strings. Example: [\"Question 1\", \"Question 2\"]",
                topic);

        String response = callGroq(prompt);

        try {
            JsonNode root = objectMapper.readTree(response);
            String content = root.path("choices").get(0)
                    .path("message").path("content").asText();
            JsonNode questionsArray = objectMapper.readTree(content);
            List<String> questions = new ArrayList<>();
            questionsArray.forEach(q -> questions.add(q.asText()));
            return questions;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse questions from Groq");
        }
    }

    public SubmitAnswerResponse evaluateAnswer(String question, String answer) {
        String prompt = String.format(
                "You are an expert technical interviewer. Evaluate this interview answer strictly and honestly.\n\n" +
                        "Question: %s\n" +
                        "Candidate's Answer: %s\n\n" +
                        "Return ONLY a JSON object with this exact format, no extra text:\n" +
                        "{\n" +
                        "  \"score\": <number 1-10>,\n" +
                        "  \"feedback\": \"<what was good and what was wrong in the answer>\",\n" +
                        "  \"improvements\": \"<specific points the candidate should improve>\",\n" +
                        "  \"idealAnswer\": \"<a complete interview-ready ideal answer for this question>\"\n" +
                        "}",
                question, answer);

        String response = callGroq(prompt);

        try {
            JsonNode root = objectMapper.readTree(response);
            String content = root.path("choices").get(0)
                    .path("message").path("content").asText();

            // Clean markdown code blocks if Groq wraps in ```json
            content = content.replaceAll("```json", "").replaceAll("```", "").trim();

            JsonNode result = objectMapper.readTree(content);
            return SubmitAnswerResponse.builder()
                    .score(result.path("score").asInt())
                    .feedback(result.path("feedback").asText())
                    .improvements(result.path("improvements").asText())
                    .idealAnswer(result.path("idealAnswer").asText())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse evaluation from Groq");
        }
    }

    private String callGroq(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt);

        Map<String, Object> body = Map.of(
                "model", MODEL,
                "messages", List.of(message),
                "temperature", 0.7);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(
                GROQ_URL, entity, String.class);

        return response.getBody();
    }
}
