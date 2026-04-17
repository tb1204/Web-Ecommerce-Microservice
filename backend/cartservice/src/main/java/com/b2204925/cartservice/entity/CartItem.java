//package com.b2204925.cartservice.entity;
//
//public class CartItem {
//}
// entity/CartItem.java
package com.b2204925.cartservice.entity;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    private String productId;
    private String variantId;
    private String name;
    private String image;
    private int quantity;
    private double price;
    private String size;
    private String thickness;
    private String color;
    private double lineTotal;

}
