package com.b2204925.chatservice.websocket;

import com.b2204925.chatservice.dto.req.SendMessageRequest;
import com.b2204925.chatservice.dto.res.DialogflowResponse;
import com.b2204925.chatservice.dto.res.MessageResponse;
import com.b2204925.chatservice.entity.Conversation;
import com.b2204925.chatservice.dto.res.ConversationResponse;
import com.b2204925.chatservice.entity.ConversationStatus;
import com.b2204925.chatservice.entity.MessageType;
import com.b2204925.chatservice.entity.SenderRole;
import com.b2204925.chatservice.service.ConversationService;
import com.b2204925.chatservice.service.DialogflowService;
import com.b2204925.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final ConversationService conversationService;
    private final DialogflowService dialogflowService;

    // Xử lý khi người dùng gửi tin nhắn (User hoặc Admin)
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest req, StompHeaderAccessor accessor) {

        Principal principal = accessor.getUser();
        if (principal == null) {
            log.error("No authentication in WebSocket session");
            return;
        }

        Jwt jwt = ((JwtAuthenticationToken) principal).getToken();

        // Lấy thông tin từ Clerk JWT
        String senderId = jwt.getSubject();           // "sub" là userId chính thức của Clerk
        String roleStr = jwt.getClaimAsString("role");

        if (roleStr == null || roleStr.isBlank()) {
            roleStr = "user";
        }

        SenderRole senderRole = SenderRole.USER;
        try {
            senderRole = SenderRole.valueOf(roleStr.toUpperCase());
        } catch (Exception e) {
            log.warn("Unknown role '{}' from JWT, defaulting to USER", roleStr);
            senderRole = SenderRole.USER;
        }

        log.info("=== [CHAT.SEND] Received - SenderId: {}, Role: {}, ConvId: {}, Type: {} ===",
                senderId, senderRole, req.getConversationId(), req.getType());

        try {
            Conversation conv = conversationService.findById(req.getConversationId());

            if (conv.getStatus() == ConversationStatus.CLOSED) {
                log.warn("Conversation {} is CLOSED", req.getConversationId());
                return;
            }

            // Bảo mật: User chỉ được gửi vào conversation của chính mình
            if (senderRole == SenderRole.USER && !conv.getUserId().equals(senderId)) {
                log.warn("SECURITY: User {} tried to send message to conversation of user {}",
                        senderId, conv.getUserId());
                return;
            }

            // Xử lý gửi tin nhắn
            MessageResponse savedMsg;
            if (req.getType() == MessageType.TEXT) {
                savedMsg = messageService.sendTextMessage(
                        req.getConversationId(), senderId, senderRole.name(), req.getContent());
            } else {
                savedMsg = messageService.sendMediaMessage(
                        req.getConversationId(), senderId, senderRole.name(), req);
            }

            // Cập nhật last message
            String preview = req.getType() == MessageType.TEXT
                    ? req.getContent()
                    : (req.getType() == MessageType.IMAGE ? "[Hình ảnh]" : "[Video]");

            conversationService.updateLastMessage(req.getConversationId(), preview, senderRole);

            // Broadcast tin nhắn cho tất cả người trong phòng
            messagingTemplate.convertAndSend("/topic/conversation." + req.getConversationId(), savedMsg);

            // Nếu là USER gửi TEXT và bot đang bật → xử lý Dialogflow
            if (senderRole == SenderRole.USER
                    && Boolean.TRUE.equals(conv.getBotEnabled())
                    && Boolean.FALSE.equals(conv.getHandoffToAdmin())
                    && req.getType() == MessageType.TEXT) {

                handleBotResponse(conv, req.getContent());
            }

            log.info("Message sent successfully to conversation {}", req.getConversationId());

        } catch (Exception e) {
            log.error("Error processing /chat.send", e);
        }
    }

    /**
     * Xử lý phản hồi từ Bot (Dialogflow)
     */
    private void handleBotResponse(Conversation conv, String userText) {
        try {
            DialogflowResponse botResp = dialogflowService.detectIntent(conv.getBotSessionId(), userText);

            MessageResponse botMsg = messageService.sendBotMessage(
                    conv.getId(),
                    botResp.getResponseText(),
                    botResp.getIntent(),
                    botResp.getConfidence(),
                    botResp.getIsFallback(),
                    botResp.getQuickReplies()
            );

            conversationService.updateLastMessage(
                    conv.getId(),
                    "[Bot]: " + botResp.getResponseText(),
                    SenderRole.BOT
            );

            messagingTemplate.convertAndSend("/topic/conversation." + conv.getId(), botMsg);

            // Nếu bot không hiểu (fallback) → chuyển sang admin
            if (Boolean.TRUE.equals(botResp.getIsFallback())) {
                conversationService.adminJoin(conv.getId(), null); // null = system join
                messagingTemplate.convertAndSend("/topic/admin.newConversation",
                        conversationService.getById(conv.getId()));

                log.info("Bot fallback → handoff to admin for conversation {}", conv.getId());
            }

        } catch (Exception e) {
            log.error("Dialogflow failed for conversation {}", conv.getId(), e);
            // Nếu Dialogflow lỗi → chuyển sang admin
            try {
                conversationService.adminJoin(conv.getId(), null);
            } catch (Exception ex) {
                log.error("Handoff to admin failed", ex);
            }
        }
    }

    // ==================== CÁC METHOD KHÁC (giữ nguyên) ====================
    @MessageMapping("/chat.join")
    public void adminJoin(@Payload String conversationId, StompHeaderAccessor accessor) {
        Principal principal = accessor.getUser();
        if (principal == null) {
            return;
        }

        Jwt jwt = ((JwtAuthenticationToken) principal).getToken();
        String adminId = jwt.getSubject();

        ConversationResponse conversation = conversationService.adminJoin(conversationId, adminId);

        messagingTemplate.convertAndSend("/topic/conversation." + conversationId, conversation);
        log.info("Admin {} joined conversation {}", adminId, conversationId);
    }

    @MessageMapping("/chat.close")
    public void closeConversation(@Payload String conversationId, StompHeaderAccessor accessor) {
        Principal principal = accessor.getUser();
        if (principal == null) {
            return;
        }

        ConversationResponse conversation = conversationService.closeConversation(conversationId);
        messagingTemplate.convertAndSend("/topic/conversation." + conversationId, conversation);
        log.info("Conversation {} closed", conversationId);
    }

    @MessageMapping("/chat.read")
    public void markRead(@Payload String conversationId, StompHeaderAccessor accessor) {
        Principal principal = accessor.getUser();
        if (principal == null) {
            return;
        }

        Jwt jwt = ((JwtAuthenticationToken) principal).getToken();
        String role = jwt.getClaimAsString("role");

        if ("admin".equalsIgnoreCase(role)) {
            conversationService.markReadByAdmin(conversationId);
        } else {
            conversationService.markReadByUser(conversationId);
        }
        log.info("Marked read conversation {} by role: {}", conversationId, role);
    }
}
