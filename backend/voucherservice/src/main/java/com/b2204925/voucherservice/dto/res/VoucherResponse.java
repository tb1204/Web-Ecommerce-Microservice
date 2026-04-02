package com.b2204925.voucherservice.dto.res;

import com.b2204925.voucherservice.entity.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

// ── Trả ra frontend — map id → _id để khớp với Voucher interface ─
@Data
@Builder
public class VoucherResponse {

    @JsonProperty("_id")
    private String id;
    // ↑ MongoDB id → trả ra "_id" khớp với frontend interface

    private String code;
    private String name;
    private VoucherType voucherType;
    private DiscountType discountType;
    private Double discountValue;
    private Double maxDiscountAmount;
    private Double minOrderAmount;
    private UsageLimitDto usageLimit;
    private ValidityDto validity;
    private VoucherStatus status;
    private Boolean isStackable;
    private List<String> userUsedList;
    private String createdAt;
    private String updatedAt;

    // ── Nested DTOs ──────────────────────────────────────────────
    @Data
    @Builder
    public static class UsageLimitDto {

        private Integer total;
        private Integer perUser;
        private Integer used;
    }

    @Data
    @Builder
    public static class ValidityDto {

        private String start;
        private String end;
    }
}
