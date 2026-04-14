package com.b2204925.voucherservice.dto.req;

import com.b2204925.voucherservice.entity.DiscountType;
import com.b2204925.voucherservice.entity.VoucherStatus;
import com.b2204925.voucherservice.entity.VoucherType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateVoucherRequest {

    private String code;
    private String name;
    private VoucherType voucherType;
    private DiscountType discountType;

    @Min(value = 0, message = "Giá trị giảm không được âm")
    private Double discountValue;

    @Min(value = 0, message = "Giảm tối đa không được âm")
    private Double maxDiscountAmount;

    @Min(value = 0, message = "Giá đơn tối thiểu không được âm")
    private Double minOrderAmount;

    @Valid
    private UsageLimitDto usageLimit;   // ← nested, khớp frontend

    @Valid
    private ValidityDto validity;        // ← nested, khớp frontend

    private VoucherStatus status;
    private Boolean isStackable;

    @Data
    public static class UsageLimitDto {

        @Min(value = 1, message = "Tổng số mã phải >= 1")
        private Integer total;

        @Min(value = 1, message = "Lượt dùng/khách phải >= 1")
        private Integer perUser;
    }

    @Data
    public static class ValidityDto {

        private String start;
        private String end;
    }
}
