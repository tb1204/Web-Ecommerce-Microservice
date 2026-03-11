//package com.b2204925.cartservice.dto.req;
//
//public class UpdateQuantityRequest {
//}
// dto/request/UpdateQuantityRequest.java
package com.b2204925.cartservice.dto.req;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateQuantityRequest {

    @NotBlank(message = "productId không được để trống")
    private String productId;

    @NotBlank(message = "variantId không được để trống")
    private String variantId;

    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private int quantity;
}
