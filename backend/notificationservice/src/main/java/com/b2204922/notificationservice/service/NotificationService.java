package com.b2204922.notificationservice.service;

import com.b2204922.notificationservice.dto.NotificationRequest;
import com.b2204922.notificationservice.dto.NotificationResponse;
import com.b2204922.notificationservice.entity.Notification;
import com.b2204922.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final WebSocketService webSocketService;

    // Xử lý tin nhắn từ RabbitMQ
    public NotificationResponse createNotification(NotificationRequest request) {
        log.info("Đang xử lý thông báo cho đơn hàng: {}", request.getOrderNumber());

        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setOrderId(request.getOrderId());
        notification.setProductId(request.getProductId());
        notification.setOrderNumber(request.getOrderNumber());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setCustomerName(request.getCustomerName());
        notification.setCustomerEmail(request.getCustomerEmail());
        notification.setStatus("UNREAD");
        notification.setCreatedAt(LocalDateTime.now());

        // Lưu vào MongoDB
        Notification persisted = notificationRepository.save(notification);
        NotificationResponse response = convertToResponse(persisted);

        // Gửi Email
        if ("ORDER_STATUS".equals(request.getType())) {
            try {
                emailService.sendNotificationEmail(
                        request.getCustomerEmail(),
                        request.getTitle(),
                        request.getCustomerName(),
                        request.getOrderNumber(),
                        request.getNewStatus()
                );
            } catch (Exception e) {
                log.warn("Gửi mail thất bại: {}", e.getMessage());
            }
        }

        // Bắn WebSocket
        try {
            webSocketService.sendNotificationToUser(request.getUserId(), response);
        } catch (Exception e) {
            log.warn("Bắn WebSocket thất bại: {}", e.getMessage());
        }

        return response;
    }

    // Lấy danh sách thông báo cho Frontend (Cái chuông)
    public List<NotificationResponse> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Đánh dấu đã đọc (Mất dấu chấm đỏ)
    public NotificationResponse markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo!"));

        notification.setStatus("READ");
         notification.setReadAt(LocalDateTime.now());

        return convertToResponse(notificationRepository.save(notification));
    }

    // Chuyển Entity sang DTO
    private NotificationResponse convertToResponse(Notification notification) {
        NotificationResponse res = new NotificationResponse();
        res.setId(notification.getId());
        res.setUserId(notification.getUserId());
        res.setOrderId(notification.getOrderId());
        res.setProductId(notification.getProductId());
        res.setOrderNumber(notification.getOrderNumber());
        res.setTitle(notification.getTitle());
        res.setMessage(notification.getMessage());
        res.setType(notification.getType());
        res.setStatus(notification.getStatus());
        res.setCreatedAt(notification.getCreatedAt());
        res.setCustomerName(notification.getCustomerName());
        res.setCustomerEmail(notification.getCustomerEmail());
        return res;
    }

    // Xóa 1 thông báo cụ thể
    public void deleteNotification(String notificationId) {
        try {
            notificationRepository.deleteById(notificationId);
            log.info(" Đã xóa thông báo: {}", notificationId);
        } catch (Exception e) {
            log.error(" Lỗi khi xóa thông báo {}: {}", notificationId, e.getMessage());
            throw new RuntimeException("Không thể xóa thông báo");
        }
    }

    // Xóa tất cả thông báo của một người dùng
    public void deleteUserNotifications(String userId) {
        try {
            // Tìm tất cả thông báo của user đó rồi xóa hết
            List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
            notificationRepository.deleteAll(notifications);
            log.info("Đã dọn sạch thông báo cho user: {}", userId);
        } catch (Exception e) {
            log.error("Lỗi khi dọn thông báo cho user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Không thể dọn sạch thông báo");
        }
    }
}
