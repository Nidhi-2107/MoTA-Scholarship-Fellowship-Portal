package com.mota.scholarship.ai;

import com.mota.scholarship.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/query")
    public ResponseEntity<ApiResponse<ChatbotDtos.ChatResponse>> query(@RequestBody ChatbotDtos.ChatRequest request) {
        String sessionId = request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString();
        return ResponseEntity.ok(ApiResponse.success(
                "Success", chatbotService.processQuery(request.getQuery(), sessionId)));
    }
}
