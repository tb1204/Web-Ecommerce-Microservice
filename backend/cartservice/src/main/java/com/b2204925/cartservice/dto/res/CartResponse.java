//package com.b2204925.cartservice.dto.res;
//
//public class CartResponse {
//}
// dto/response/CartResponse.java
package com.b2204925.cartservice.dto.res;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CartResponse {

    private String id;
    private String userId;
    private List<CartItemResponse> items;
    private int totalQty;       // tổng số lượng — tính động
    private double totalPrice;  // tổng tiền — tính động
}
