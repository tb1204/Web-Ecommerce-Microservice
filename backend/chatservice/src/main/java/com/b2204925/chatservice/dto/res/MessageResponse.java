package com.b2204925.chatservice.dto.res;

import com.b2204925.chatservice.entity.MessageMetadata;
import com.b2204925.chatservice.entity.MessageType;
import com.b2204925.chatservice.entity.SenderRole;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class MessageResponse {

    private String id;
    private String conversationId;
    private String senderId;
    private SenderRole senderRole;
    private MessageType type;
    private String content;
    private String mediaUrl;
    private String thumbnailUrl;
    private String mimeType;
    private Integer duration;
    private Long mediaSize;
    private MessageMetadata metadata;
    private Boolean isDeleted;
    private Instant createdAt;
}
