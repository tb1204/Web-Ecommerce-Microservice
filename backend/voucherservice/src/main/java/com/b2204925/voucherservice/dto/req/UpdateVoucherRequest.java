package com.b2204925.voucherservice.dto.req;

import com.b2204925.voucherservice.entity.DiscountType;
import com.b2204925.voucherservice.entity.VoucherStatus;
import com.b2204925.voucherservice.entity.VoucherType;
import jakarta.validation.Valid;
import lombok.Data;

@Data
public class UpdateVoucherRequest {

    private String code;
    private String name;
    private VoucherType voucherType;
    private DiscountType discountType;
    private Double discountValue;
    private Double maxDiscountAmount;
    private Double minOrderAmount;

    @Valid
    private UsageLimitDto usageLimit;   // ← nested, khớp frontend

    @Valid
    private ValidityDto validity;        // ← nested, khớp frontend

    private VoucherStatus status;
    private Boolean isStackable;

    @Data
    public static class UsageLimitDto {

        private Integer total;
        private Integer perUser;
    }

    @Data
    public static class ValidityDto {

        private String start;
        private String end;
    }
}
