package com.b2204925.chatservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // Conversation errors
    CONVERSATION_NOT_FOUND("CHAT_001", "Không tìm thấy cuộc trò chuyện", HttpStatus.NOT_FOUND),
    CONVERSATION_ALREADY_EXISTS("CHAT_002", "Bạn đã có cuộc trò chuyện đang mở", HttpStatus.CONFLICT),
    CONVERSATION_CLOSED("CHAT_003", "Cuộc trò chuyện đã kết thúc", HttpStatus.BAD_REQUEST),
    // Message errors
    MESSAGE_NOT_FOUND("CHAT_004", "Không tìm thấy tin nhắn", HttpStatus.NOT_FOUND),
    MESSAGE_TOO_LARGE("CHAT_005", "File quá lớn", HttpStatus.BAD_REQUEST),
    MESSAGE_TYPE_NOT_SUPPORTED("CHAT_006", "Loại file không được hỗ trợ", HttpStatus.BAD_REQUEST),
    // Auth errors
    UNAUTHORIZED("AUTH_001", "Chưa xác thực", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("AUTH_002", "Không có quyền truy cập", HttpStatus.FORBIDDEN),
    // System errors
    UPLOAD_FAILED("CHAT_007", "Upload file thất bại", HttpStatus.INTERNAL_SERVER_ERROR),
    DIALOGFLOW_ERROR("CHAT_008", "Lỗi kết nối Dialogflow", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR("SYS_001", "Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
