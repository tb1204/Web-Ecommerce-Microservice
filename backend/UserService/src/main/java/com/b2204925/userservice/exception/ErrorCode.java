package com.b2204925.userservice.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
public enum ErrorCode {

    // User errors
    USER_NOT_FOUND("USER_001", "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("USER_002", "Người dùng đã tồn tại", HttpStatus.CONFLICT),
    EMAIL_ALREADY_EXISTS("USER_003", "Email đã được sử dụng", HttpStatus.CONFLICT),
    CLERK_ID_REQUIRED("USER_004", "Clerk ID là bắt buộc", HttpStatus.BAD_REQUEST),
    CLERK_ID_ALREADY_EXISTS("USER_005", "Clerk ID đã tồn tại", HttpStatus.CONFLICT),

    // Clerk API errors
    CLERK_BAN_FAILED("CLERK_001", "Không thể chặn tài khoản trên Clerk", HttpStatus.INTERNAL_SERVER_ERROR),
    CLERK_UNBAN_FAILED("CLERK_002", "Không thể bỏ chặn tài khoản trên Clerk", HttpStatus.INTERNAL_SERVER_ERROR),
    CLERK_LOCK_FAILED("CLERK_003", "Không thể khóa tài khoản trên Clerk", HttpStatus.INTERNAL_SERVER_ERROR),
    CLERK_UNLOCK_FAILED("CLERK_004", "Không thể mở khóa tài khoản trên Clerk", HttpStatus.INTERNAL_SERVER_ERROR),
    CLERK_DELETE_FAILED("CLERK_005", "Không thể xóa tài khoản trên Clerk", HttpStatus.INTERNAL_SERVER_ERROR),
    CLERK_CREATE_FAILED("CLERK_006", "Không thể tạo tài khoản trên Clerk", HttpStatus.INTERNAL_SERVER_ERROR),
    CLERK_SYNC_FAILED("CLERK_007", "Không thể đồng bộ trạng thái với Clerk", HttpStatus.INTERNAL_SERVER_ERROR),

    // Auth errors
    UNAUTHORIZED("AUTH_001", "Chưa xác thực", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("AUTH_002", "Không có quyền truy cập", HttpStatus.FORBIDDEN),

    // General errors
    INTERNAL_SERVER_ERROR("SYS_001", "Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_REQUEST("SYS_002", "Dữ liệu không hợp lệ", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
