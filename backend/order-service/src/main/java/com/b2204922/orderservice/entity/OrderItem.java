package com.b2204922.orderservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data //tu dong tao cac ham getter/setter
@Builder //Tao doi tuong theo kieu lap rap
@NoArgsConstructor //Tao ham xay dung khong tham so
@AllArgsConstructor //Tao ham xay dung day du tham so
public class OrderItem {
    private String productId;
    private String variantId;
    private String productName;
    private Integer quantity;
    private Double price;
    private Double lineTotal;
}
