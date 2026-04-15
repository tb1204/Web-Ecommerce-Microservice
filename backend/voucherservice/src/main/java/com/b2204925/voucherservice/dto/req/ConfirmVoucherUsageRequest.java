package com.b2204925.voucherservice.dto.req;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ConfirmVoucherUsageRequest {

    @NotEmpty(message = "Phải có ít nhất 1 mã voucher")
    private List<String> codes;

    @NotNull
    @Min(value = 0)
    private Double orderAmount;
}
