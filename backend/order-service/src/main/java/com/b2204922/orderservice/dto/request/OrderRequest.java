package com.b2204922.orderservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    private String userId; // ID của người mua

    // Thông tin người nhận
    private String name;
    private String phone;
    private String email;
    private String shippingAddress;

    private String variantId;
    private List<OrderItemRequest> items;

    private String paymentMethod;

    private String cancelReason;

    private String note;
}
