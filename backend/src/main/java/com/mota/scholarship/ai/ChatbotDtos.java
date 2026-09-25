package com.mota.scholarship.ai;

import lombok.Builder;
import lombok.Data;

import java.util.List;

public class ChatbotDtos {

    @Data
    public static class ChatRequest {
        private String query;
        private String sessionId;
    }

    @Data
    @Builder
    public static class ChatResponse {
        private String sessionId;
        private String answer;
        private double confidence;
        private String source;
        private List<String> suggestedActions;
    }
}
