package com.b2204925.voucherservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsageLimit {

    private Integer total;    // Tổng số lượt dùng
    private Integer perUser;  // Giới hạn mỗi user
    @Builder.Default
    private Integer used = 0; // Đã dùng (tăng mỗi khi apply thành công)
}
