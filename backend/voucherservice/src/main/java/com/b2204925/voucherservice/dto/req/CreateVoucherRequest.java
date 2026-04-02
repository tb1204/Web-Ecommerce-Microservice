package com.b2204925.voucherservice.dto.req;

import com.b2204925.voucherservice.entity.DiscountType;
import com.b2204925.voucherservice.entity.VoucherType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

// ── Dùng cho Admin tạo voucher mới ──────────────────────────────
@Data
public class CreateVoucherRequest {

    @NotBlank(message = "Mã voucher không được trống")
    private String code;

    @NotBlank(message = "Tên voucher không được trống")
    private String name;

    @NotNull(message = "Loại voucher không được trống")
    private VoucherType voucherType;

    @NotNull(message = "Loại giảm giá không được trống")
    private DiscountType discountType;

    @NotNull
    @Min(value = 1, message = "Giá trị giảm phải >= 1")
    private Double discountValue;

    @NotNull
    @Min(value = 0)
    private Double maxDiscountAmount;

    @NotNull
    @Min(value = 0)
    private Double minOrderAmount;

    // ── ĐÃ ĐỔI: flat fields → nested DTO khớp với frontend ──────
    @NotNull
    @Valid
    private UsageLimitDto usageLimit;

    @NotNull
    @Valid
    private ValidityDto validity;

    private Boolean isStackable = false;

    // ── Nested: khớp với { usageLimit: { total, perUser } } ─────
    @Data
    public static class UsageLimitDto {

        @NotNull
        @Min(value = 1, message = "Tổng số mã phải >= 1")
        private Integer total;

        @NotNull
        @Min(value = 1, message = "Lượt dùng/khách phải >= 1")
        private Integer perUser;
    }

    // ── Nested: khớp với { validity: { start, end } } ───────────
    // Frontend gửi ISO string từ datetime-local input
    @Data
    public static class ValidityDto {

        @NotBlank(message = "Ngày bắt đầu không được trống")
        private String start;

        @NotBlank(message = "Ngày kết thúc không được trống")
        private String end;
    }
}
