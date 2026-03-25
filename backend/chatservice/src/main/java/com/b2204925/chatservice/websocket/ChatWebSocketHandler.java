package com.b2204925.chatservice.websocket;

import com.b2204925.chatservice.dto.req.SendMessageRequest;
import com.b2204925.chatservice.dto.res.DialogflowResponse;
import com.b2204925.chatservice.dto.res.MessageResponse;
import com.b2204925.chatservice.entity.*;
import com.b2204925.chatservice.exception.AppException;
import com.b2204925.chatservice.service.ConversationService;
import com.b2204925.chatservice.service.DialogflowService;
import com.b2204925.chatservice.service.MessageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;

import com.b2204925.chatservice.dto.res.ConversationResponse;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final ConversationService conversationService;
    private final DialogflowService dialogflowService;

    // ── Gửi tin nhắn ─────────────────────────────────────────────
    @MessageMapping("/chat.send")
    public void sendMessage(
            @Payload SendMessageRequest req,
            @AuthenticationPrincipal Jwt jwt) {

        String senderId = jwt.getSubject();
        String roleStr = jwt.getClaimAsString("role").toUpperCase();
        SenderRole senderRole = SenderRole.valueOf(roleStr);

        Conversation conversation = conversationService.findById(req.getConversationId());

        if (conversation.getStatus() == ConversationStatus.CLOSED) {
            log.warn("Cannot send to closed conversation {}", req.getConversationId());
            return;
        }

        // Lưu tin nhắn vào DB
        MessageResponse messageResponse;
        if (req.getType() == MessageType.TEXT) {
            messageResponse = messageService.sendTextMessage(
                    req.getConversationId(), senderId, roleStr, req.getContent()
            );
        } else {
            messageResponse = messageService.sendMediaMessage(
                    req.getConversationId(), senderId, roleStr, req
            );
        }

        // Cập nhật lastMessage + lastSenderRole
        String preview = req.getType() == MessageType.TEXT
                ? req.getContent()
                : req.getType() == MessageType.IMAGE ? "[Hình ảnh]" : "[Video]";

        conversationService.updateLastMessage(
                req.getConversationId(), preview, senderRole
        );

        // Gửi realtime đến tất cả trong phòng
        messagingTemplate.convertAndSend(
                "/topic/conversation." + req.getConversationId(),
                messageResponse
        );

        // Nếu user gửi TEXT và bot đang bật → gọi Dialogflow
        if (senderRole == SenderRole.USER
                && conversation.getBotEnabled()
                && !conversation.getHandoffToAdmin()
                && req.getType() == MessageType.TEXT) {
            handleBotResponse(conversation, req.getContent());
        }
    }

    // ── Xử lý Dialogflow ─────────────────────────────────────────
    private void handleBotResponse(Conversation conversation, String userText) {
        try {
            DialogflowResponse botResponse = dialogflowService.detectIntent(
                    conversation.getBotSessionId(), userText
            );

            // Lưu bot message
            MessageResponse botMessage = messageService.sendBotMessage(
                    conversation.getId(),
                    botResponse.getResponseText(),
                    botResponse.getIntent(),
                    botResponse.getConfidence(),
                    botResponse.getIsFallback(),
                    botResponse.getQuickReplies()
            );

            // Cập nhật lastMessage
            conversationService.updateLastMessage(
                    conversation.getId(),
                    "[Bot]: " + botResponse.getResponseText(),
                    SenderRole.BOT
            );

            // Gửi bot response realtime
            messagingTemplate.convertAndSend(
                    "/topic/conversation." + conversation.getId(),
                    botMessage
            );

            // Bot không hiểu → chuyển admin
            if (botResponse.getIsFallback()) {
                conversationService.adminJoin(conversation.getId(), null);

                // Thông báo admin có phòng mới
                messagingTemplate.convertAndSend(
                        "/topic/admin.newConversation",
                        conversationService.getById(conversation.getId())
                );

                // Gửi system message realtime
                MessageResponse systemMsg = messageService.sendSystemMessage(
                        conversation.getId(),
                        "Đang kết nối với nhân viên hỗ trợ..."
                );
                messagingTemplate.convertAndSend(
                        "/topic/conversation." + conversation.getId(),
                        systemMsg
                );

                log.info("Bot fallback → handoff admin for conversation {}",
                        conversation.getId());
            }

        } catch (AppException e) {
            log.error("Dialogflow error: {}", e.getMessage());
            // Lỗi → chuyển admin
            conversationService.adminJoin(conversation.getId(), null);
            messagingTemplate.convertAndSend(
                    "/topic/admin.newConversation",
                    conversationService.getById(conversation.getId())
            );
        }
    }

    // ── Admin vào phòng ──────────────────────────────────────────
    @MessageMapping("/chat.join")
    public void adminJoin(
            @Payload String conversationId,
            @AuthenticationPrincipal Jwt jwt) {

        String adminId = jwt.getSubject();
        ConversationResponse conversation = conversationService.adminJoin(
                conversationId, adminId
        );

        // Thông báo cho tất cả trong phòng
        messagingTemplate.convertAndSend(
                "/topic/conversation." + conversationId, conversation
        );

        log.info("Admin {} joined conversation {}", adminId, conversationId);
    }

    // ── Đóng phòng ───────────────────────────────────────────────
    @MessageMapping("/chat.close")
    public void closeConversation(
            @Payload String conversationId,
            @AuthenticationPrincipal Jwt jwt) {

        ConversationResponse conversation = conversationService
                .closeConversation(conversationId);

        // Thông báo cho tất cả trong phòng
        messagingTemplate.convertAndSend(
                "/topic/conversation." + conversationId, conversation
        );

        log.info("Conversation {} closed by {}", conversationId, jwt.getSubject());
    }

    // ── Mark read ────────────────────────────────────────────────
    @MessageMapping("/chat.read")
    public void markRead(
            @Payload String conversationId,
            @AuthenticationPrincipal Jwt jwt) {

        String role = jwt.getClaimAsString("role");

        if ("admin".equalsIgnoreCase(role)) {
            conversationService.markReadByAdmin(conversationId);
        } else {
            conversationService.markReadByUser(conversationId);
        }

        log.info("Marked read conversation {} by {}", conversationId, jwt.getSubject());
    }
}
