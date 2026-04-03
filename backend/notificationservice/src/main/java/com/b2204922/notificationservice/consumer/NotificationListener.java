package com.b2204922.notificationservice.consumer;

import com.b2204922.notificationservice.config.RabbitMQConfig;
import com.b2204922.notificationservice.dto.NotificationRequest;
import com.b2204922.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {
    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    public void handleNotification(NotificationRequest request) {
        log.info("Đã nhận tin nhắn từ RabbitMQ cho đơn hàng: {}", request.getOrderNumber());

        try {
            // Gọi service để: Lưu DB -> Gửi Mail -> Bắn WebSocket
            notificationService.createNotification(request);
            log.info("Xử lý thông báo thành công cho đơn #{}", request.getOrderNumber());
        } catch (Exception e) {
            log.error("Lỗi xử lý thông báo: {}", e.getMessage());
            // Nếu lỗi, RabbitMQ sẽ giữ lại tin nhắn để thử lại (Retry) sau
        }
    }
}
