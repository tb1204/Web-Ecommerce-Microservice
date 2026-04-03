package com.b2204922.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private String userId;
    private String orderId;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String title;
    private String message;
    private String type;
    private String productId;
    private String newStatus; // Trạng thái mới để gửi Mail
}
