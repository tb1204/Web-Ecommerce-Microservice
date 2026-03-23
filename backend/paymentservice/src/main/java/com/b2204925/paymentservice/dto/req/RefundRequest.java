// package com.b2204925.paymentservice.dto.req;
// public class RefundRequest {
// }
package com.b2204925.paymentservice.dto.req;

import lombok.Data;

@Data
public class RefundRequest {

    private Long refundAmount;
    private String refundReason;
}
