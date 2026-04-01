package com.b2204922.notificationservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    private String id;
    private String userId;
    private String orderId;
    private String orderNumber;
    private String title;
    private String message;
    private String type; // ORDER_STATUS, COMMENT
    private String productId;
    private String status; // READ, UNREAD
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private String customerName;
    private String customerEmail;
}
