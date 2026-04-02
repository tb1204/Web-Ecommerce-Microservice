package com.b2204925.voucherservice.dto.res;

import lombok.Builder;
import lombok.Data;

// ── Kết quả khi user apply voucher thành công ───────────────────
@Data
@Builder
public class ApplyVoucherResponse {

    private VoucherResponse voucher;
    private Double originalAmount;   // Tiền trước giảm
    private Double discountAmount;   // Số tiền được giảm
    private Double finalAmount;      // Tiền sau giảm
    private String message;
}
