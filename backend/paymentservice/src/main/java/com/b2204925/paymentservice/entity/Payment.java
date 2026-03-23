// package com.b2204925.paymentservice.entity;
// public class Payment {
// }
package com.b2204925.paymentservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    private String orderId;
    private String userId;

    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;

    private Long amount;

    @Builder.Default
    private String currency = "VND";

    private String transactionId;
    private String paymentUrl;
    private String responseCode;
    private Instant expiresAt;
    private String paymentGatewayResponse;

    private String voucherCode;

    @Builder.Default
    private Long voucherDiscount = 0L;

    @Builder.Default
    private Long refundAmount = 0L;

    private String refundReason;
    private Instant refundedAt;
    private Instant paidAt;
    private String failedReason;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
