package com.b2204925.cartservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartSummary {

    private double subtotal;
    private double shippingThreshold;
    private int totalQty;
}
