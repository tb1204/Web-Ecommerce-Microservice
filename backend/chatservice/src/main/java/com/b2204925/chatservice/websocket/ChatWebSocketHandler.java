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
                    && req.getType() == MessageType.TEXT) {

                boolean isLocked = Boolean.TRUE.equals(conv.getHandoffToAdmin());

                if ("Chat với Admin".equalsIgnoreCase(req.getContent().trim())) {
                    if (!isLocked) {
                        log.info("User requested handoff to admin for conversation {}", conv.getId());
                        
                        // Gửi tin nhắn thông báo cho user trước khi chuyển
                        MessageResponse botConfirmMsg = messageService.sendBotMessage(
                                conv.getId(),
                                "Đã ngắt kết nối với Bot, Admin sẽ hỗ trợ bạn ngay.",
                                "handoff",
                                1.0,
                                false,
                                null
                        );
                        messagingTemplate.convertAndSend("/topic/conversation." + conv.getId(), botConfirmMsg);
                        
                        // Chuyển sang admin
                        conversationService.adminJoin(conv.getId(), null);
                        messagingTemplate.convertAndSend("/topic/admin.newConversation",
                                conversationService.getById(conv.getId()));
                    }
                } else {
                    if (isLocked) {
                        // Bị lock nhưng người dùng nhắn tin, thử xem Bot có hiểu không
                        try {
                            DialogflowResponse testResp = dialogflowService.detectIntent(conv.getBotSessionId(), req.getContent());
                            if (Boolean.FALSE.equals(testResp.getIsFallback())) {
                                // Câu hợp lệ! Tự động unlock (Chuyển lại cho Bot)
                                conversationService.enableBot(conv.getId());
                                conv = conversationService.findById(conv.getId()); // refresh
                                
                                // Bot trả lời câu hợp lệ
                                MessageResponse botMsg = messageService.sendBotMessage(
                                        conv.getId(),
                                        testResp.getResponseText(),
                                        testResp.getIntent(),
                                        testResp.getConfidence(),
                                        testResp.getIsFallback(),
                                        testResp.getQuickReplies(),
                                        testResp.getProductLinks()
                                );
                                conversationService.updateLastMessage(conv.getId(), "[Bot]: " + testResp.getResponseText(), SenderRole.BOT);
                                messagingTemplate.convertAndSend("/topic/conversation." + conv.getId(), botMsg);
                                
                                // Báo Admin biết phòng đã về lại tay Bot
                                messagingTemplate.convertAndSend("/topic/admin.newConversation", conversationService.getById(conv.getId()));
                            }
                            // Nếu vẫn là câu ngoài lề (fallback), bot im lặng để Admin giải quyết
                        } catch (Exception e) {
                            log.error("Test intent for locked conversation failed", e);
                        }
                    } else {
                        // Đang mở, xử lý bình thường
                        handleBotResponse(conv, req.getContent());
                    }
                }
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

            String botText = botResp.getResponseText();
            if (Boolean.TRUE.equals(botResp.getIsFallback())) {
                botText = "Xin lỗi, tôi chưa hiểu rõ ý của bạn. Bạn có thể nói rõ hơn về việc muốn tìm nệm, chăn ga, hay kiểm tra đơn hàng không ạ?";
            }

            MessageResponse botMsg = messageService.sendBotMessage(
                    conv.getId(),
                    botText,
                    botResp.getIntent(),
                    botResp.getConfidence(),
                    botResp.getIsFallback(),
                    botResp.getQuickReplies(),
                    botResp.getProductLinks()   // ← truyền productLinks vào db
            );

            conversationService.updateLastMessage(
                    conv.getId(),
                    "[Bot]: " + botText,
                    SenderRole.BOT
            );

            messagingTemplate.convertAndSend("/topic/conversation." + conv.getId(), botMsg);

            // Nếu bot không hiểu (fallback) → chuyển sang admin
            if (Boolean.TRUE.equals(botResp.getIsFallback())) {
                conversationService.adminJoin(conv.getId(), null);
                
                // Tạo một message ảo để push lên WebSocket ngay lập tức cho User thấy (DB đã lưu qua adminJoin)
                MessageResponse sysMsg = MessageResponse.builder()
                        .id("sys_" + System.currentTimeMillis())
                        .conversationId(conv.getId())
                        .senderId("SYSTEM")
                        .senderRole(SenderRole.BOT)
                        .type(MessageType.SYSTEM)
                        .content("Đã chuyển qua trò chuyện với admin")
                        .createdAt(java.time.Instant.now())
                        .build();
                messagingTemplate.convertAndSend("/topic/conversation." + conv.getId(), sysMsg);
                
                // Broadcast lại trạng thái conversation để nút trên UI cập nhật
                messagingTemplate.convertAndSend("/topic/conversation." + conv.getId(), conversationService.getById(conv.getId()));

                messagingTemplate.convertAndSend("/topic/admin.newConversation",
                        conversationService.getById(conv.getId()));

                log.info("Bot fallback → handoff to admin for conversation {}", conv.getId());
            }

        } catch (Exception e) {
            log.error("Dialogflow failed for conversation {}", conv.getId(), e);
            try {
                conversationService.adminJoin(conv.getId(), null);
                messagingTemplate.convertAndSend("/topic/admin.newConversation",
                        conversationService.getById(conv.getId()));
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
