package com.b2204925.chatservice.dto.req;

import lombok.Data;

@Data
public class CreateConversationRequest {

    private String firstMessage;
    private String userDisplayName;
// Frontend truyền tên user lên khi tạo phòng
    private String userAvatarUrl;
// Frontend truyền avatar url lên khi tạo phòng
    // Tin nhắn đầu tiên khi tạo phòng (optional)
    // VD: "Chào, mình muốn hỏi về đơn hàng"
}
