package com.mota.scholarship.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * OpenAI Service for AI-assisted semantic interpretation and chatbot assistance.
 * Gracefully degrades when OPENAI_API_KEY is not configured.
 */
@Service
@Slf4j
public class OpenAiService {

    private final String apiKey;
    private final String model;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public OpenAiService(
            @Value("${app.openai.api-key:${OPENAI_API_KEY:}}") String apiKey,
            @Value("${app.openai.model:${OPENAI_MODEL:gpt-4o-mini}}") String model,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.model = model != null && !model.isBlank() ? model : "gpt-4o-mini";
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();

        if (isConfigured()) {
            log.info("OpenAI Service initialized successfully with model: {}", this.model);
        } else {
            log.info("OpenAI API key not configured. Operating in deterministic rules & knowledge-base mode.");
        }
    }

    public boolean isConfigured() {
        return !apiKey.isEmpty();
    }

    public String askQuestion(String systemPrompt, String userMessage) {
        if (!isConfigured()) {
            log.debug("OpenAI API key not configured; skipping remote AI call.");
            return null;
        }

        try {
            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userMessage)
                    ),
                    "temperature", 0.3,
                    "max_tokens", 500
            );

            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode choices = root.path("choices");
                if (choices.isArray() && !choices.isEmpty()) {
                    return choices.get(0).path("message").path("content").asText();
                }
            } else {
                log.warn("OpenAI API returned non-200 status code: {}", response.statusCode());
            }
        } catch (Exception e) {
            log.error("Failed to query OpenAI API: {}", e.getMessage());
        }

        return null;
    }
}
