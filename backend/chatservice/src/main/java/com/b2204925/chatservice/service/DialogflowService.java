package com.b2204925.chatservice.service;

import com.b2204925.chatservice.dto.res.DialogflowResponse;
import com.b2204925.chatservice.exception.AppException;
import com.b2204925.chatservice.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class DialogflowService {

    @Value("${dialogflow.project-id}")
    private String projectId;

    @Value("${dialogflow.language-code}")
    private String languageCode;

    private final RestTemplate restTemplate = new RestTemplate();

    public DialogflowResponse detectIntent(String sessionId, String text) {
        try {
            String url = "https://dialogflow.googleapis.com/v2/projects/"
                    + projectId
                    + "/agent/sessions/" + sessionId
                    + ":detectIntent";

            Map<String, Object> queryInput = Map.of(
                    "text", Map.of(
                            "text", text,
                            "languageCode", languageCode
                    )
            );

            Map<String, Object> requestBody = Map.of("queryInput", queryInput);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // ── Parse queryResult ────────────────────────────────
            Map queryResult = (Map) response.getBody().get("queryResult");

            String fulfillmentText = (String) queryResult.get("fulfillmentText");

            Map intent = (Map) queryResult.get("intent");
            String intentName = intent != null ? (String) intent.get("displayName") : null;

            Double confidence = (Double) queryResult.get("intentDetectionConfidence");

            boolean isFallback = intentName != null && intentName.contains("Fallback");

            // ── Parse quickReplies ───────────────────────────────
            List<String> quickReplies = new ArrayList<>();
            // ↑ Khởi tạo list rỗng trước

            var fulfillmentMessages = (List) queryResult.get("fulfillmentMessages");
            // Dialogflow trả về danh sách message, mỗi message có thể chứa quickReplies

            if (fulfillmentMessages != null) {
                for (Object msg : fulfillmentMessages) {
                    Map msgMap = (Map) msg;
                    Map quickRepliesMap = (Map) msgMap.get("quickReplies");
                    // quickRepliesMap = { "quickReplies": ["Xem đơn hàng", "Hủy đơn"] }

                    if (quickRepliesMap != null) {
                        quickReplies = (List<String>) quickRepliesMap.get("quickReplies");
                        // Lấy danh sách nút gợi ý
                    }
                }
            }
            // ────────────────────────────────────────────────────

            log.info("Dialogflow intent: {} | confidence: {} | fallback: {}",
                    intentName, confidence, isFallback);

            return DialogflowResponse.builder()
                    .responseText(fulfillmentText)
                    .intent(intentName)
                    .confidence(confidence)
                    .isFallback(isFallback)
                    .quickReplies(quickReplies) // ← thêm
                    .build();

        } catch (Exception e) {
            log.error("Dialogflow error: ", e);
            throw new AppException(ErrorCode.DIALOGFLOW_ERROR);
        }
    }
}
