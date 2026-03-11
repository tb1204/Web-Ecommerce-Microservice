//package com.b2204925.cartservice.dto.res;
//
//public class CartItemResponse {
//}
// ═══════════════════════════════════════════════════════
// DTO - RESPONSE
// ═══════════════════════════════════════════════════════
// dto/response/CartItemResponse.java
package com.b2204925.cartservice.dto.res;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponse {

    private String productId;
    private String variantId;
    private String productName;
    private String image;
    private int quantity;
    private double price;
    private double subtotal;   // price * quantity — tính động
    private String size;
    private String thickness;
    private String color;
}
