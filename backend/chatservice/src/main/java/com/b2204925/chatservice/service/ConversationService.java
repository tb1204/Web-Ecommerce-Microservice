package com.b2204925.chatservice.service;

import com.b2204925.chatservice.dto.req.CreateConversationRequest;
import com.b2204925.chatservice.dto.res.ConversationResponse;
import com.b2204925.chatservice.dto.res.MessageResponse;
import com.b2204925.chatservice.entity.*;
import com.b2204925.chatservice.exception.AppException;
import com.b2204925.chatservice.exception.ErrorCode;
import com.b2204925.chatservice.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageService messageService;

    // ── User tạo phòng chat ──────────────────────────────────────
    public ConversationResponse createConversation(
            String userId, CreateConversationRequest req) {

        // Kiểm tra đã có phòng WAITING chưa
        conversationRepository
                .findByUserIdAndStatus(userId, ConversationStatus.WAITING)
                .ifPresent(c -> {
                    throw new AppException(
                            ErrorCode.CONVERSATION_ALREADY_EXISTS, "Bạn đang có phòng chờ");
                });

        // Kiểm tra đã có phòng ACTIVE chưa
        conversationRepository
                .findByUserIdAndStatus(userId, ConversationStatus.ACTIVE)
                .ifPresent(c -> {
                    throw new AppException(
                            ErrorCode.CONVERSATION_ALREADY_EXISTS, "Bạn đang có phòng mở");
                });

        Conversation conversation = Conversation.builder()
                .userId(userId)
                .adminId(null)
                .status(ConversationStatus.WAITING)
                .botEnabled(true)
                .handoffToAdmin(false)
                .botSessionId(UUID.randomUUID().toString())
                .userDisplayName(req.getUserDisplayName()) // ← thêm
                .userAvatarUrl(req.getUserAvatarUrl())
                .build();

        Conversation saved = conversationRepository.save(conversation);
        log.info("Created conversation {} for user {}", saved.getId(), userId);

        // Gửi tin nhắn đầu tiên nếu có
        if (req.getFirstMessage() != null && !req.getFirstMessage().isBlank()) {
            MessageResponse msg = messageService.sendTextMessage(
                    saved.getId(), userId, "USER", req.getFirstMessage()
            );
            // Cập nhật lastMessage
            saved.setLastMessage(req.getFirstMessage());
            saved.setLastMessageAt(msg.getCreatedAt());
            saved.setLastSenderRole(SenderRole.USER);
            saved = conversationRepository.save(saved);
        }

        return toResponse(saved);
    }

    // ── Admin nhận phòng 
    public ConversationResponse adminJoin(String conversationId, String adminId) {
        Conversation conversation = findById(conversationId);

        if (conversation.getStatus() == ConversationStatus.CLOSED) {
            throw new AppException(ErrorCode.CONVERSATION_CLOSED);
        }

        conversation.setAdminId(adminId);
        conversation.setStatus(ConversationStatus.ACTIVE);
        conversation.setHandoffToAdmin(true);
        conversation.setBotEnabled(false);
        conversation.setUpdatedAt(Instant.now());

        Conversation saved = conversationRepository.save(conversation);

        // Gửi system message thông báo admin vào
        messageService.sendSystemMessage(
                conversationId, "Admin đã tham gia cuộc trò chuyện"
        );

        log.info("Admin {} joined conversation {}", adminId, conversationId);
        return toResponse(saved);
    }

    // ── Đóng phòng ───────────────────────────────────────────────
    public ConversationResponse closeConversation(String conversationId) {
        Conversation conversation = findById(conversationId);
        conversation.setStatus(ConversationStatus.CLOSED);
        conversation.setUpdatedAt(Instant.now());

        Conversation saved = conversationRepository.save(conversation);

        // Gửi system message thông báo đóng phòng
        messageService.sendSystemMessage(
                conversationId, "Cuộc trò chuyện đã kết thúc"
        );

        log.info("Closed conversation {}", conversationId);
        return toResponse(saved);
    }

    // ── Cập nhật lastMessage ─────────────────────────────────────
    public void updateLastMessage(
            String conversationId,
            String lastMessage,
            SenderRole senderRole) {

        Conversation conversation = findById(conversationId);
        conversation.setLastMessage(lastMessage);
        conversation.setLastMessageAt(Instant.now());
        conversation.setLastSenderRole(senderRole);
        conversation.setUpdatedAt(Instant.now());
        conversationRepository.save(conversation);
    }

    // ── Mark read ────────────────────────────────────────────────
    public void markReadByUser(String conversationId) {
        Conversation conversation = findById(conversationId);
        conversation.setUserLastReadAt(Instant.now());
        conversation.setUpdatedAt(Instant.now());
        conversationRepository.save(conversation);
    }

    public void markReadByAdmin(String conversationId) {
        Conversation conversation = findById(conversationId);
        conversation.setAdminLastReadAt(Instant.now());
        conversation.setUpdatedAt(Instant.now());
        conversationRepository.save(conversation);
    }

    // ── Lấy danh sách ────────────────────────────────────────────
    public List<ConversationResponse> getUserConversations(String userId) {
        return conversationRepository
                .findByUserIdOrderByLastMessageAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ConversationResponse> getConversationsByStatus(ConversationStatus status) {
        return conversationRepository
                .findByStatusOrderByLastMessageAtDesc(status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ConversationResponse getById(String conversationId) {
        return toResponse(findById(conversationId));
    }

    // ── Helper ───────────────────────────────────────────────────
    public Conversation findById(String conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
    }
    // Trong ConversationService.java

    public ConversationResponse togglePin(String conversationId) {
        Conversation conv = findById(conversationId);
        conv.setIsPinned(!Boolean.TRUE.equals(conv.getIsPinned()));
        conv.setUpdatedAt(Instant.now());
        conversationRepository.save(conv);
        return toResponse(conv);
    }

    public ConversationResponse toggleMute(String conversationId) {
        Conversation conv = findById(conversationId);
        conv.setIsMuted(!Boolean.TRUE.equals(conv.getIsMuted()));
        conv.setUpdatedAt(Instant.now());
        conversationRepository.save(conv);
        return toResponse(conv);
    }

    // ── Chuyển lại cho Bot ────────────────────────────────────────
    public ConversationResponse enableBot(String conversationId) {
        Conversation conversation = findById(conversationId);
        if (conversation.getStatus() == ConversationStatus.CLOSED) {
            throw new AppException(ErrorCode.CONVERSATION_CLOSED);
        }
        conversation.setAdminId(null);
        conversation.setStatus(ConversationStatus.WAITING);
        conversation.setHandoffToAdmin(false);
        conversation.setBotEnabled(true);
        conversation.setUpdatedAt(Instant.now());
        Conversation saved = conversationRepository.save(conversation);

        // Gửi system message thông báo
        messageService.sendSystemMessage(
                conversationId, "Đã chuyển lại cho Bot AI. Hãy tiếp tục nhắn tin!"
        );

        log.info("Bot re-enabled for conversation {}", conversationId);
        return toResponse(saved);
    }

    private ConversationResponse toResponse(Conversation c) {
        return ConversationResponse.builder()
                .id(c.getId())
                .userId(c.getUserId())
                .adminId(c.getAdminId())
                .status(c.getStatus())
                .lastMessage(c.getLastMessage())
                .lastMessageAt(c.getLastMessageAt())
                .lastSenderRole(c.getLastSenderRole())
                .userLastReadAt(c.getUserLastReadAt())
                .adminLastReadAt(c.getAdminLastReadAt())
                .botEnabled(c.getBotEnabled())
                .handoffToAdmin(c.getHandoffToAdmin())
                .tags(c.getTags())
                .userDisplayName(c.getUserDisplayName())
                .userAvatarUrl(c.getUserAvatarUrl())
                .isPinned(c.getIsPinned())
                .isMuted(c.getIsMuted())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
