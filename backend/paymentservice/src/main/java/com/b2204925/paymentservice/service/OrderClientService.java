package com.b2204925.paymentservice.service;

// package com.b2204925.paymentservice.client;
// package com.b2204925.paymentservice.client;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderClientService {

    private final RestTemplate restTemplate;

    @Value("${order.service.url:http://localhost:8084}")
    private String orderServiceUrl;

    /**
     * Gọi order-service để cập nhật trạng thái thanh toán của đơn hàng
     */
    public void updatePaymentStatus(String orderNumber, String paymentStatus, String transactionId) {
        String url = orderServiceUrl + "/api/orders/payment-status/" + orderNumber
                + "?status=" + paymentStatus
                + "&transactionId=" + (transactionId != null ? transactionId : "");
        try {
            restTemplate.patchForObject(url, null, Void.class);
            log.info("✅ Đã cập nhật payment status '{}' cho order {}", paymentStatus, orderNumber);
        } catch (Exception e) {
            log.warn("⚠️ Không thể gọi order-service: {}", e.getMessage());
        }
    }
    // public void updatePaymentStatus(String orderId, String paymentStatus, String transactionId) {
    //     // ✅ Dùng endpoint by-id thay vì by-orderNumber
    //     String url = orderServiceUrl + "/api/orders/payment-status-by-id/" + orderId
    //             + "?status=" + paymentStatus
    //             + "&transactionId=" + (transactionId != null ? transactionId : "");
    //     try {
    //         restTemplate.patchForObject(url, null, Void.class);
    //         log.info("✅ Đã cập nhật payment status '{}' cho order id {}", paymentStatus, orderId);
    //     } catch (Exception e) {
    //         log.warn("⚠️ Không thể gọi order-service: {}", e.getMessage());
    //     }
    // }
}
