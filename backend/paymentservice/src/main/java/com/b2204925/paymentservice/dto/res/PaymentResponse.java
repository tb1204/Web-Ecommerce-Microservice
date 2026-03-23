// package com.b2204925.paymentservice.dto.res;
// public class PaymentResponse {
// }
package com.b2204925.paymentservice.dto.res;

import com.b2204925.paymentservice.entity.PaymentMethod;
import com.b2204925.paymentservice.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class PaymentResponse {

    private String id;
    private String orderId;
    private String userId;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private Long amount;
    private String currency;
    private String paymentUrl;
    private String transactionId;
    private String voucherCode;
    private Long voucherDiscount;
    private Long refundAmount;
    private String refundReason;
    private String failedReason;
    private Instant paidAt;
    private Instant createdAt;
    private Instant updatedAt;
}
