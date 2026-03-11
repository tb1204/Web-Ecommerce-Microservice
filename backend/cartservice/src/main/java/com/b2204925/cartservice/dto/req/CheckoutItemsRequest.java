//package com.b2204925.cartservice.dto.req;
//
//public class CheckoutItemsRequest {
//}
// dto/request/CheckoutItemsRequest.java
package com.b2204925.cartservice.dto.req;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class CheckoutItemsRequest {

    @NotEmpty(message = "Danh sách variantId không được trống")
    private List<String> variantIds;
}
