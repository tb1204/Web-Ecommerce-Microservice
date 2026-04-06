// package com.b2204922.orderservice.dto.response;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class OrderItemResponse {
//     private String productId;
//     private String productName;
//     private String productImage;
//     private Integer quantity;
//     private Double price;
//     private Double lineTotal;
// }
package com.b2204922.orderservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private String productId;
    private String productName;
    private String productImage; // ✅ THÊM
    private Integer quantity;
    private Double price;
    private Double lineTotal;
    private String size;         // ✅ THÊM
    private String thickness;    // ✅ THÊM
    private String color;        // ✅ THÊM
}
