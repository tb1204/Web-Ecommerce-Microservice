package com.b2204925.voucherservice.dto.req;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// ── Dùng khi User áp dụng voucher ở checkout ────────────────────
@Data
public class ApplyVoucherRequest {

    @NotBlank(message = "Mã voucher không được trống")
    private String code;

    @NotNull
    @Min(value = 0)
    private Double orderAmount;
    // Tổng tiền đơn hàng (trước khi giảm)
}
