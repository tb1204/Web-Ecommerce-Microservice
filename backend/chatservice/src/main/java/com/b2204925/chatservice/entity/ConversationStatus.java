package com.b2204925.chatservice.entity;

public enum ConversationStatus {
    WAITING, // Chờ — bot đang xử lý hoặc chờ admin
    BOT_ONLY, // Chỉ bot trả lời, chưa cần admin
    ACTIVE, // Admin đã vào, đang chat trực tiếp
    CLOSED      // Đã kết thúc
}
