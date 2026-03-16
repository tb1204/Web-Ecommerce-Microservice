package com.b2204925.cartservice.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Lỗi nghiệp vụ
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ex) {
        ErrorCode code = ex.getErrorCode();
        return ResponseEntity
                .status(code.getHttpStatus())
                .body(ErrorResponse.builder()
                        .code(code.getCode())
                        .message(code.getMessage())
                        .timestamp(Instant.now())
                        .build());
    }

    // Lỗi validation @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String detail = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .findFirst()
                .orElse("Dữ liệu không hợp lệ");

        return ResponseEntity
                .badRequest()
                .body(ErrorResponse.builder()
                        .code("CART_400")
                        .message("Dữ liệu không hợp lệ")
                        .detail(detail)
                        .timestamp(Instant.now())
                        .build());
    }

    // Lỗi hệ thống
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        return ResponseEntity
                .internalServerError()
                .body(ErrorResponse.builder()
                        .code("SYS_001")
                        .message("Lỗi hệ thống")
                        .detail(ex.getMessage())
                        .timestamp(Instant.now())
                        .build());
    }
}
