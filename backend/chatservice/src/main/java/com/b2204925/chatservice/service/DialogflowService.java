package com.b2204925.chatservice.service;

import com.b2204925.chatservice.dto.res.DialogflowResponse;
import com.b2204925.chatservice.exception.AppException;
import com.b2204925.chatservice.exception.ErrorCode;
import com.google.auth.oauth2.GoogleCredentials;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
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

    private GoogleCredentials credentials;
    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct
    public void init() {
        try {
            InputStream keyStream = new ClassPathResource("dialogflow-key.json").getInputStream();
            this.credentials = GoogleCredentials.fromStream(keyStream)
                    .createScoped("https://www.googleapis.com/auth/cloud-platform");
            log.info("Khởi tạo GoogleCredentials từ dialogflow-key.json thành công! Chatbot đã kích hoạt đầy đủ.");
        } catch (Exception e) {
            log.error("Tuyệt đối không tìm thấy tệp dialogflow-key.json hoặc đọc lỗi: ", e);
        }
    }

    public DialogflowResponse detectIntent(String sessionId, String text) {
        if (this.credentials == null) {
            log.error("GoogleCredentials bị null do thiếu file lúc khởi động.");
            return DialogflowResponse.builder()
                    .responseText("🚨 Lỗi: Thiếu file cấu hình Dialogflow (dialogflow-key.json).")
                    .intent("fallback")
                    .confidence(1.0)
                    .isFallback(false)
                    .quickReplies(List.of())
                    .build();
        }

        try {
            // Lấy/Refresh Access Token 
            this.credentials.refreshIfExpired();
            String accessToken = this.credentials.getAccessToken().getTokenValue();

            String url = "https://dialogflow.googleapis.com/v2/projects/"
                    + projectId + "/agent/sessions/" + sessionId + ":detectIntent";

            Map<String, Object> queryInput = Map.of(
                    "text", Map.of(
                            "text", text,
                            "languageCode", languageCode
                    )
            );

            Map<String, Object> requestBody = Map.of("queryInput", queryInput);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken); // ĐÂY LÀ CHÌA KHOÁ

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // ── Parse queryResult
            Map queryResult = (Map) response.getBody().get("queryResult");

            String fulfillmentText = (String) queryResult.get("fulfillmentText");

            Map intent = (Map) queryResult.get("intent");
            String intentName = intent != null ? (String) intent.get("displayName") : null;

            Object confObj = queryResult.get("intentDetectionConfidence");
            Double confidence = confObj instanceof Number ? ((Number) confObj).doubleValue() : 0.0;
            boolean isFallback = intentName != null && intentName.toLowerCase().contains("fallback");

            // ── Parse quickReplies
            List<String> quickReplies = new ArrayList<>();
            var fulfillmentMessages = (List) queryResult.get("fulfillmentMessages");

            if (fulfillmentMessages != null) {
                for (Object msgObj : fulfillmentMessages) {
                    Map msgMap = (Map) msgObj;
                    Map quickRepliesMap = (Map) msgMap.get("quickReplies");
                    if (quickRepliesMap != null) {
                        List<String> rawReplies = (List<String>) quickRepliesMap.get("quickReplies");
                        if (rawReplies != null) {
                            quickReplies.addAll(rawReplies);
                        }
                    }
                }
            }
            
            log.info("Dialogflow trả lời: intent = {} | confidence = {}", intentName, confidence);

            return DialogflowResponse.builder()
                    .responseText(fulfillmentText)
                    .intent(intentName)
                    .confidence(confidence)
                    .isFallback(isFallback)
                    .quickReplies(quickReplies)
                    .build();

        } catch (Exception e) {
            log.error("Lỗi khi kết nối Google Dialogflow API: ", e);
            String errorMessage = e.getMessage() != null ? e.getMessage() : e.toString();
            return DialogflowResponse.builder()
                    .responseText("🚨 Lỗi kỹ thuật từ Google: " + errorMessage + "\n(Hãy kiểm tra lại quyền IAM hoặc API Services)")
                    .intent("fallback")
                    .confidence(1.0)
                    .isFallback(false)
                    .quickReplies(List.of())
                    .build();
        }
    }
}
