package com.b2204922.orderservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationClientService {

    private final RestTemplate restTemplate;

    // URL này sẽ trỏ đến Notification Service
    @Value("${notification.service.url:http://localhost:9002}")
    private String notificationServiceUrl;

    /**
     * Hàm dùng chung để gửi yêu cầu POST dạng Form sang Notification Service
     */
    private void postForm(String path, MultiValueMap<String, String> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        String url = notificationServiceUrl + path;
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("✅ Đã gửi dữ liệu thông báo thành công tới: {}", url);
            }
        } catch (Exception e) {
            // Chúng ta chỉ log lỗi chứ không chặn luồng chính của Order
            log.warn("⚠️ Không thể kết nối tới Notification Service tại {}: {}", url, e.getMessage());
        }
    }

    /**
     * Gửi thông báo thay đổi trạng thái đơn hàng (Dùng cho cả tạo mới, cập nhật và hủy)
     */
    public void sendOrderStatusNotification(
            String userId,
            String orderId,
            String orderNumber,
            String customerName,
            String customerEmail,
            String customerPhone,
            String oldStatus,
            String newStatus
    ) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("userId", userId);
        body.add("orderId", orderId);
        body.add("orderNumber", orderNumber);
        body.add("customerName", customerName);
        body.add("customerEmail", customerEmail);
        body.add("customerPhone", customerPhone);
        body.add("oldStatus", oldStatus);
        body.add("newStatus", newStatus);

        postForm("/api/notifications/order-status", body);
    }
}