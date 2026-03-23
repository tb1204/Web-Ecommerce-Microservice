package com.b2204925.chatservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    private String userId;
    private String adminId;

    private ConversationStatus status;
    // WAITING | ACTIVE | BOT_ONLY | CLOSED

    private String lastMessage;
    private Instant lastMessageAt;

    private SenderRole lastSenderRole;
    // USER | BOT | ADMIN
    // Dùng để hiển thị "Bot đang trả lời" hoặc "Admin đang hỗ trợ"

    // ── Read tracking ────────────────────────────────────────────
    private Instant userLastReadAt;
    // Thời điểm user đọc tin cuối
    // Tin chưa đọc của user = message.createdAt > userLastReadAt

    private Instant adminLastReadAt;
    // Thời điểm admin đọc tin cuối
    // Tin chưa đọc của admin = message.createdAt > adminLastReadAt

    // Thêm vào sau field tags:
    private String userDisplayName;
// Snapshot tên user khi tạo conversation
// Để admin thấy tên, không cần gọi user-service

    private String userAvatarUrl;
// Snapshot avatar user

    @Builder.Default
    private Boolean isPinned = false;
// Admin ghim conversation

    @Builder.Default
    private Boolean isMuted = false;
// Admin tắt thông báo

    // ── Dialogflow ───────────────────────────────────────────────
    @Builder.Default
    private Boolean botEnabled = true;

    @Builder.Default
    private Boolean handoffToAdmin = false;

    private String botSessionId;

    // ── Tags ─────────────────────────────────────────────────────
    private List<String> tags;
    // VD: ["order_456", "urgent", "complaint"]

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
