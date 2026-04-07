package com.b2204922.orderservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
@Data //tu dong tao cac ham getter/setter
@Builder //Tao doi tuong theo kieu lap rap
@NoArgsConstructor //Tao ham xay dung khong tham so
@AllArgsConstructor //Tao ham xay dung day du tham so
public class Order {
    @Id
    private String id;

    private String orderNumber;
    private String userId;

    private String note;
    private CustomerInfo customerInfo;
    private Summary summary;
    private Payment payment;
    private String orderStatus;
    private String cancelReason;
    private LocalDateTime cancelledAt;
    private List<OrderItem> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerInfo {
        private String name;
        private String phone;
        private String email;
        private String shippingAddress;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Summary {
        private Double totalAmount;
        private Double shippingFee;
        private Integer totalQty;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Payment {
        private String method;
        private String status;
        private String transactionId;
    }
}
