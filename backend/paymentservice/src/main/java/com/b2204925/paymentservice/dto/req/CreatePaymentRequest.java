// package com.b2204925.paymentservice.dto.req;
// public class CreatePaymentRequest {
// }
package com.b2204925.paymentservice.dto.req;

import com.b2204925.paymentservice.entity.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreatePaymentRequest {

    @NotBlank
    private String orderId;

    @NotNull
    private PaymentMethod paymentMethod;

    @NotNull
    @Positive
    private Long amount;

    private String voucherCode;
    private Long voucherDiscount;
    private String clientIp;
}
