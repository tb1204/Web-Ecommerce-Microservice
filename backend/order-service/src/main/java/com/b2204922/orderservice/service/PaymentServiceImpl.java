package com.b2204922.orderservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
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
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("refundAmount", amount.longValue());
        requestBody.put("refundReason", "Admin hủy đơn hàng và hoàn tiền tự động");

        try {
            log.info(" Đang gọi API hoàn tiền (JSON): {}", url);

            restTemplate.execute(url, org.springframework.http.HttpMethod.PATCH,
                    request -> {

                        request.getHeaders().setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

                        new org.springframework.http.converter.json.MappingJackson2HttpMessageConverter()
                                .getObjectMapper()
                                .writeValue(request.getBody(), requestBody);
                    },
                    response -> null
            );

            log.info(" Hoàn tiền thành công!");
            return true;
        } catch (Exception e) {
            log.error(" LỖI RỒI: {}", e.getMessage());
            return false;
        }
    }
}
