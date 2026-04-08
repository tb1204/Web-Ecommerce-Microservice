package com.b2204922.orderservice.service;

import com.b2204922.orderservice.config.RabbitMQConfig;
import com.b2204922.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentStatusListener {
    private final OrderRepository orderRepository;


    @RabbitListener(queues = RabbitMQConfig.PAYMENT_UPDATE_QUEUE)
    public void handlePaymentUpdate(Map<String, String> message) {
        log.info("[RabbitMQ] Nhận tin nhắn từ Payment Service: {}", message);

        String orderId = message.get("orderId");
        String status = message.get("status");
        String transactionId = message.get("transactionId");

        // Tìm và cập nhật Database của Order Service
        orderRepository.findById(orderId).ifPresentOrElse(order -> {
            // Cập nhật trạng thái (nhớ check xem logic của ông là order.setPaymentStatus hay order.getPayment().setStatus)
            if (order.getPayment() != null) {
                order.getPayment().setStatus(status);
                order.getPayment().setTransactionId(transactionId);
                orderRepository.save(order);
                log.info("Đã đồng bộ trạng thái '{}' cho Order: {}", status, orderId);
            }
        }, () -> {
            log.warn("⚠ Không tìm thấy đơn hàng ID: {} để đồng bộ", orderId);
        });
    }
}
