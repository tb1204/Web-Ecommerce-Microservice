package com.b2204922.orderservice.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private String id;
    private String orderNumber;
    private String userId;

    private String note;
    private CustomerInfoResponse customerInfo;
    private SummaryResponse summary;
    private PaymentResponse payment;

    private List<OrderItemResponse> items;

    private String orderStatus;
    private String cancelReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CustomerInfoResponse {
        private String name;
        private String phone;
        private String email;
        private String shippingAddress;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SummaryResponse {
        private Double totalAmount;
        private Double shippingFee;
        private Integer totalQty;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PaymentResponse {
        private String method;
        private String status;
        private String transactionId;
    }

}
