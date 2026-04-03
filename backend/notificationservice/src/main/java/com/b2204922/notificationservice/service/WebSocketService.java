package com.b2204922.notificationservice.service;

import com.b2204922.notificationservice.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotificationToUser(String userId, NotificationResponse notification) {
        try {
            String destination = "/topic/notifications/" + userId;
            messagingTemplate.convertAndSend(destination, notification);
            log.info("Đã bắn WebSocket tới User: {}", userId);
        } catch (Exception e) {
            log.error("Lỗi WebSocket tới User {}: {}", userId, e.getMessage());
        }
    }
}
