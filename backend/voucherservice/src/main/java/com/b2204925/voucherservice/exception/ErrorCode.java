package com.b2204925.voucherservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // Voucher errors
    VOUCHER_NOT_FOUND("VCH_001", "Không tìm thấy voucher", HttpStatus.NOT_FOUND),
    VOUCHER_CODE_DUPLICATE("VCH_002", "Mã voucher đã tồn tại", HttpStatus.CONFLICT),
    VOUCHER_EXPIRED("VCH_003", "Voucher đã hết hạn", HttpStatus.BAD_REQUEST),
    VOUCHER_DISABLED("VCH_004", "Voucher đã bị vô hiệu hóa", HttpStatus.BAD_REQUEST),
    VOUCHER_NOT_STARTED("VCH_005", "Voucher chưa đến thời gian áp dụng", HttpStatus.BAD_REQUEST),
    VOUCHER_EXCEEDED_TOTAL("VCH_006", "Voucher đã hết lượt sử dụng", HttpStatus.BAD_REQUEST),
    VOUCHER_EXCEEDED_PER_USER("VCH_007", "Bạn đã đạt giới hạn sử dụng voucher này", HttpStatus.BAD_REQUEST),
    VOUCHER_MIN_ORDER_NOT_MET("VCH_008", "Đơn hàng chưa đạt giá trị tối thiểu để dùng voucher", HttpStatus.BAD_REQUEST),
    VOUCHER_ALREADY_USED("VCH_009", "Bạn đã sử dụng voucher này rồi", HttpStatus.BAD_REQUEST),
    // Auth errors
    UNAUTHORIZED("AUTH_001", "Chưa xác thực", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("AUTH_002", "Không có quyền truy cập", HttpStatus.FORBIDDEN),
    // General errors
    INVALID_REQUEST("SYS_002", "Dữ liệu không hợp lệ", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER_ERROR("SYS_001", "Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
