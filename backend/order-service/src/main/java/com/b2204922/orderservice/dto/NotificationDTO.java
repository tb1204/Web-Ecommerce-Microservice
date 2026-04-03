package com.b2204922.orderservice.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDTO {
    private String userId;
    private String orderId;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String title;
    private String message;
    private String type; //  "ORDER_STATUS"  "COMMENT"
    private String productId;
    private String newStatus;
}
