//package com.b2204925.cartservice.exception;
//
//public class ErrorCode {
//}


// ═══════════════════════════════════════════════════════
// EXCEPTION
// ═══════════════════════════════════════════════════════

// exception/ErrorCode.java
package com.b2204925.cartservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    CART_NOT_FOUND       ("CART_001", "Không tìm thấy giỏ hàng",                  HttpStatus.NOT_FOUND),
    ITEM_NOT_FOUND       ("CART_002", "Không tìm thấy sản phẩm trong giỏ hàng",   HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND    ("CART_003", "Không tìm thấy sản phẩm",                  HttpStatus.NOT_FOUND),
    VARIANT_NOT_FOUND    ("CART_004", "Không tìm thấy variant sản phẩm",           HttpStatus.NOT_FOUND),
    INVALID_QUANTITY     ("CART_005", "Số lượng không hợp lệ",                    HttpStatus.BAD_REQUEST),
    PRODUCT_SERVICE_ERROR("CART_006", "Không thể kết nối tới product-service",    HttpStatus.SERVICE_UNAVAILABLE);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}