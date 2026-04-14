// package com.b2204925.paymentservice.exception;
// public class ErrorCode {
// }
package com.b2204925.paymentservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    PAYMENT_NOT_FOUND("PAY_001", "Không tìm thấy thanh toán", HttpStatus.NOT_FOUND),
    PAYMENT_ALREADY_EXISTS("PAY_002", "Đơn hàng đã có thanh toán", HttpStatus.CONFLICT),
    INVALID_PAYMENT_STATUS("PAY_003", "Trạng thái thanh toán không hợp lệ", HttpStatus.BAD_REQUEST),
    VNPAY_ERROR("PAY_004", "Lỗi kết nối VNPay", HttpStatus.BAD_GATEWAY),
    UNAUTHORIZED("AUTH_001", "Chưa xác thực", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("AUTH_002", "Không có quyền truy cập", HttpStatus.FORBIDDEN),
    INTERNAL_ERROR("SYS_001", "Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),
    PAYMENT_ERROR("9999", "Lỗi giao dịch thanh toán", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
