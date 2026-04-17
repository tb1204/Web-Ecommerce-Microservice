package com.b2204922.orderservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    private String productId;
    private String variantId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private Double price;
    private Double lineTotal;
    private String size;
    private String thickness;
    private String color;
}
