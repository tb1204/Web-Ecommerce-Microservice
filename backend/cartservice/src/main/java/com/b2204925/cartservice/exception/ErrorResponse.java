package com.b2204925.cartservice.exception;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class ErrorResponse {

    private String code;
    private String message;
    private String detail;
    private Instant timestamp;
}
