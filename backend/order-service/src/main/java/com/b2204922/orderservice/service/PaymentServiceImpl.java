package com.b2204922.orderservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements IPaymentService {

    private final RestTemplate restTemplate;

    @Value("${payment.service.url:http://localhost:8085}")
    private String paymentServiceUrl;

    @Override
    public boolean refund(String orderId, Double amount) {
        String url = paymentServiceUrl + "/api/payments/order/" + orderId + "/refund";

        // 1. Lấy Token từ Request hiện tại (Token mà Bằng gửi từ Frontend)
        String token = null;
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            token = attributes.getRequest().getHeader("Authorization");
        }

        // 2. Chuẩn bị Body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("refundAmount", amount.longValue());
        requestBody.put("refundReason", "Admin hủy đơn hàng và hoàn tiền tự động");

        // 3. Chuẩn bị Header (Đính kèm Token vào đây!)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (token != null) {
//            headers.set("Authorization", token); // Truyền nguyên cây "Bearer <token>" sang luôn
            headers.set("Authorization", token.startsWith("Bearer ") ? token : "Bearer " + token);
        }

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            log.info(" Đang gọi API hoàn tiền kèm Token: {}", url);

            // 4. Dùng exchange với phương thức PATCH
            restTemplate.exchange(url, HttpMethod.PATCH, entity, Void.class);

            log.info(" Hoàn tiền thành công!");
            return true;
        } catch (Exception e) {
            log.error(" LỖI HOÀN TIỀN: {}", e.getMessage());
            return false;
        }
    }
}
