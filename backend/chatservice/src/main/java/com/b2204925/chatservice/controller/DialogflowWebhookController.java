package com.b2204925.chatservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat/dialogflow")
@RequiredArgsConstructor
@Slf4j
public class DialogflowWebhookController {

    private final RestTemplate restTemplate;

    @PostMapping("/webhook")
    public Map<String, Object> handleWebhook(@RequestBody Map<String, Object> request) {
        log.info("Received Webhook Request from Dialogflow: {}", request);

        Map<String, Object> queryResult = (Map<String, Object>) request.get("queryResult");
        
        String intentName = "";
        if (queryResult != null && queryResult.get("intent") != null) {
            Map<String, Object> intent = (Map<String, Object>) queryResult.get("intent");
            intentName = (String) intent.get("displayName");
        }
        
        Map<String, Object> parameters = queryResult != null ? (Map<String, Object>) queryResult.get("parameters") : null;

        // Câu trả lời mặc định nếu không xử lý được
        String responseText = "Xin lỗi, tôi không thể xử lý yêu cầu này lúc này.";

        try {
            if ("check_order".equals(intentName) || (queryResult != null && "check_order".equals(queryResult.get("action")))) {
                String orderId = parameters != null ? (String) parameters.get("order_id") : null;
                if (orderId == null || orderId.isBlank()) {
                    responseText = "Bạn vui lòng cung cấp mã đơn hàng. Ví dụ: O12345.";
                } else {
                    responseText = fetchOrderStatus(orderId);
                }
            } else {
                // Nếu gọi webhook mà không phải check_order, lấy giá trị fulfillmentText mặc định mà Dialogflow đã tạo
                if (queryResult != null && queryResult.get("fulfillmentText") != null) {
                    responseText = (String) queryResult.get("fulfillmentText");
                }
            }
        } catch (Exception e) {
            log.error("Lỗi khi gọi service khác qua Webhook", e);
            responseText = "Hệ thống đang bận hoặc không tìm thấy thông tin bạn yêu cầu, vui lòng thử lại sau.";
        }

        // Tạo JSON trả về đúng chuẩn Dialogflow WebhookResponse
        Map<String, Object> response = new HashMap<>();
        response.put("fulfillmentText", responseText);

        return response;
    }

    private String fetchOrderStatus(String orderId) {
        try {
            // Chuẩn hóa orderId nếu cần (ví dụ xoá khoảng trắng)
            orderId = orderId.trim();
            // Gọi qua order-service (Được route qua Eureka bằng @LoadBalanced RestTemplate)
            String url = "http://order-service/api/orders/" + orderId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> order = response.getBody();
                String status = (String) order.get("status");
                
                // Trả về câu thông báo trạng thái
                return "Đơn hàng " + orderId + " của bạn hiện đang ở trạng thái: " + mapStatus(status) + ".";
            }
        } catch (Exception e) {
            log.warn("Không tìm thấy đơn hàng {} trong CSDL order-service.", orderId);
        }
        return "Tôi không tìm thấy đơn hàng mã " + orderId + " trong hệ thống. Bạn vui lòng kiểm tra lại mã nhé!";
    }

    private String mapStatus(String status) {
        if (status == null) return "Không xác định";
        return switch (status.toUpperCase()) {
            case "PENDING" -> "Đang chờ xử lý";
            case "PROCESSING" -> "Đang xử lý / đóng gói";
            case "SHIPPING" -> "Đang giao hàng";
            case "DELIVERED" -> "Đã giao thành công";
            case "CANCELLED" -> "Đã hủy";
            default -> status;
        };
    }
}
