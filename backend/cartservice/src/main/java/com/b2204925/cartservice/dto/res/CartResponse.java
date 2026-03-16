//package com.b2204925.cartservice.dto.res;
//
//public class CartResponse {
//}
// dto/response/CartResponse.java
package com.b2204925.cartservice.dto.res;

import java.util.List;

import com.b2204925.cartservice.entity.CartSummary;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartResponse {

    private String id;
    private String userId;
    private List<CartItemResponse> items;
    private CartSummary summary;
    private String note;
    private String status;
    // private int totalQty;      
    //  //tổng số lượng — tính động
    // private double totalPrice;   
    // //tổng tiền — tính động
}
