package com.b2204925.chatservice.dto.req;

import com.b2204925.chatservice.entity.MessageType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendMessageRequest {

    @NotNull
    private String conversationId;

    @NotNull
    private MessageType type;
    // TEXT | IMAGE | VIDEO
    private String content;
    private String mediaUrl;
    // Bắt buộc nếu type = IMAGE hoặc VIDEO
    private String thumbnailUrl;
    // Preview nhỏ cho ảnh/video
    private String mimeType;  // VD: "image/jpeg", "video/mp4"
    private Long mediaSize;    // Bytes
    private Integer duration;// Giây — chỉ có khi type = VIDEO

}
