package com.b2204922.orderservice.service;

import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements IPaymentService {
    @Override
    public boolean refund(String transactionId, Double amount) {
        // GIẢ LẬP: Hiện tại cứ trả về true để test logic Order trước
        System.out.println("💳 [PAYMENT SYSTEM] Đang kết nối tới cổng thanh toán...");
        System.out.println("💰 [REFUND] Đang hoàn số tiền: " + amount + " cho mã GD: " + transactionId);

        // SAU NÀY: Bằng sẽ dùng RestTemplate/WebClient gọi API VNPay ở đây
        // return restTemplate.postForObject("https://vnpay.vn/refund-api", request, Boolean.class);

        return true;
    }
}
