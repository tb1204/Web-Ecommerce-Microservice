package com.b2204925.chatservice.service;

import com.b2204925.chatservice.dto.req.SendMessageRequest;
import com.b2204925.chatservice.dto.res.MessageResponse;
import com.b2204925.chatservice.entity.*;
import com.b2204925.chatservice.exception.AppException;
import com.b2204925.chatservice.exception.ErrorCode;
import com.b2204925.chatservice.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    // code thật
    public MessageResponse sendTextMessage(
            String conversationId,
            String senderId,
            String senderRole,
            String content) {

        log.info("=== [2] sendTextMessage START - convId: {}, sender: {}, content: {}",
                conversationId, senderId, content);

        Message message = Message.builder()
                .conversationId(conversationId)
                .senderId(senderId)
                .senderRole(SenderRole.valueOf(senderRole))
                .type(MessageType.TEXT)
                .content(content)
                .metadata(MessageMetadata.builder().build())
                .build();

        Message saved = messageRepository.save(message);
        log.info("=== [2] TEXT MESSAGE SAVED TO MONGODB - ID: {} ===", saved.getId());

        return toResponse(saved);
    }

    // ── Gửi MEDIA (ảnh/video) ────────────────────────── code thật
    public MessageResponse sendMediaMessage(
            String conversationId,
            String senderId,
            String senderRole,
            SendMessageRequest req) {

        log.info("=== [3] sendMediaMessage START - convId: {}, sender: {}, type: {}",
                conversationId, senderId, req.getType());

        if (req.getMediaUrl() == null || req.getMediaUrl().isBlank()) {
            throw new AppException(ErrorCode.MESSAGE_TYPE_NOT_SUPPORTED,
                    "mediaUrl không được để trống");
        }

        Message message = Message.builder()
                .conversationId(conversationId)
                .senderId(senderId)
                .senderRole(SenderRole.valueOf(senderRole))
                .type(req.getType())
                .mediaUrl(req.getMediaUrl())
                .thumbnailUrl(req.getThumbnailUrl())
                .mimeType(req.getMimeType())
                .mediaSize(req.getMediaSize())
                .duration(req.getDuration())
                .metadata(MessageMetadata.builder().build())
                .build();

        Message saved = messageRepository.save(message);
        log.info("=== [3] MEDIA MESSAGE SAVED TO MONGODB - ID: {} ===", saved.getId());

        return toResponse(saved);
    }

    // ── Gửi BOT message ──────────────────────────────────────────
    public MessageResponse sendBotMessage(
            String conversationId,
            String responseText,
            String intent,
            Double confidence,
            Boolean isFallback,
            List<String> quickReplies) {

        return sendBotMessage(conversationId, responseText, intent, confidence, isFallback, quickReplies, null);
    }

    // ── Gửi BOT message với productLinks ─────────────────────────
    public MessageResponse sendBotMessage(
            String conversationId,
            String responseText,
            String intent,
            Double confidence,
            Boolean isFallback,
            List<String> quickReplies,
            List<MessageMetadata.ProductLink> productLinks) {

        Message message = Message.builder()
                .conversationId(conversationId)
                .senderId("BOT")
                .senderRole(SenderRole.BOT)
                .type(MessageType.TEXT)
                .content(responseText)
                .metadata(MessageMetadata.builder()
                        .isBotResponse(true)
                        .intent(intent)
                        .confidence(confidence)
                        .botFallback(isFallback)
                        .quickReplies(quickReplies)
                        .productLinks(productLinks)
                        .build())
                .build();

        return toResponse(messageRepository.save(message));
    }

    // ── Gửi SYSTEM message ───────────────────────────────────────
    public MessageResponse sendSystemMessage(
            String conversationId,
            String content) {
        // VD: "Admin đã tham gia cuộc trò chuyện"
        //     "Cuộc trò chuyện đã kết thúc"

        Message message = Message.builder()
                .conversationId(conversationId)
                .senderId("SYSTEM")
                .senderRole(SenderRole.BOT)
                .type(MessageType.SYSTEM)
                .content(content)
                .build();

        return toResponse(messageRepository.save(message));
    }

    // ── Lấy lịch sử tin nhắn ────────────────────────────────────
    public List<MessageResponse> getMessages(String conversationId) {
        return messageRepository
                .findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── Lấy tin nhắn có phân trang ───────────────────────────────
    public Page<MessageResponse> getMessagesPaged(
            String conversationId, int page, int size) {
        return messageRepository
                .findByConversationIdOrderByCreatedAtDesc(
                        conversationId, PageRequest.of(page, size))
                .map(this::toResponse);
    }

    // ── Xóa mềm tin nhắn ────────────────────────────────────────
    public MessageResponse deleteMessage(String messageId, String requesterId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new AppException(ErrorCode.MESSAGE_NOT_FOUND));

        if (!message.getSenderId().equals(requesterId)) {
            throw new AppException(ErrorCode.FORBIDDEN,
                    "Bạn không có quyền xóa tin nhắn này");
        }

        message.setIsDeleted(true);
        message.setContent("[Tin nhắn đã bị xóa]");
        message.setMediaUrl(null);
        message.setThumbnailUrl(null);

        return toResponse(messageRepository.save(message));
    }

    // ── Helper: convert Entity → DTO ─────────────────────────────
    public MessageResponse toResponse(Message m) {
        return MessageResponse.builder()
                .id(m.getId())
                .conversationId(m.getConversationId())
                .senderId(m.getSenderId())
                .senderRole(m.getSenderRole())
                .type(m.getType())
                .content(m.getContent())
                .mediaUrl(m.getMediaUrl())
                .thumbnailUrl(m.getThumbnailUrl())
                .mimeType(m.getMimeType())
                .mediaSize(m.getMediaSize())
                .duration(m.getDuration())
                .metadata(m.getMetadata())
                .isDeleted(m.getIsDeleted())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
