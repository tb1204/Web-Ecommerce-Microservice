package com.b2204925.voucherservice.dto.res;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VoucherStats {

    private long total;        // tổng số voucher
    private long active;       // đang hoạt động
    private long expired;      // hết hạn
    private long disabled;     // vô hiệu hóa
    private long totalUsed;    // tổng lượt đã dùng (quan trọng)
}
