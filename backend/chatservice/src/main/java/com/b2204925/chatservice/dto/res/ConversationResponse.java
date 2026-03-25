package com.b2204925.chatservice.dto.res;

import com.b2204925.chatservice.entity.ConversationStatus;
import com.b2204925.chatservice.entity.SenderRole;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class ConversationResponse {

    private String id;
    private String userId;
    private String adminId;
    private ConversationStatus status;
    private String lastMessage;
    private Instant lastMessageAt;
    private SenderRole lastSenderRole;   // ← thêm
    private Instant userLastReadAt;      // ← thêm
    private Instant adminLastReadAt;     // ← thêm
    private Boolean botEnabled;
    private Boolean handoffToAdmin;
    // Thêm 4 field tương ứng:
    private String userDisplayName;
    private String userAvatarUrl;
    private Boolean isPinned;
    private Boolean isMuted;
    private List<String> tags;           // ← thêm
    private Instant createdAt;
    private Instant updatedAt;
}
