package com.b2204925.chatservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    private String conversationId;
    private String senderId;
    private SenderRole senderRole;
    private MessageType type;
    // TEXT | IMAGE | VIDEO | SYSTEM

    private String content;

    // ── Media ────────────────────────────────────────────────────
    private String mediaUrl;
    // URL Cloudinary

    private String thumbnailUrl;
    // Preview nhỏ cho ảnh/video

    private String mimeType;
    // VD: "image/jpeg", "video/mp4"

    private Long mediaSize;
    // Bytes

    private Integer duration;
    // Giây — chỉ có khi type = VIDEO
    // VD: 30 = video 30 giây

    // ── Dialogflow metadata ──────────────────────────────────────
    private MessageMetadata metadata;

    @Builder.Default
    private Boolean isDeleted = false;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
