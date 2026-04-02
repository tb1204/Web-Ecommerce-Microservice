package com.b2204925.voucherservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Validity {

    private Instant start; // Thời điểm bắt đầu
    private Instant end;   // Thời điểm hết hạn
}
