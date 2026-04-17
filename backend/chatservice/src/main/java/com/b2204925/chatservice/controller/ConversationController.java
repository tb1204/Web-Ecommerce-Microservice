package com.b2204925.chatservice.controller;

import com.b2204925.chatservice.dto.req.CreateConversationRequest;
import com.b2204925.chatservice.dto.res.ConversationResponse;
import com.b2204925.chatservice.dto.res.DialogflowResponse;
import com.b2204925.chatservice.dto.res.MessageResponse;
import com.b2204925.chatservice.entity.ConversationStatus;
import com.b2204925.chatservice.entity.SenderRole;
import com.b2204925.chatservice.service.ConversationService;
import com.b2204925.chatservice.service.DialogflowService;
import com.b2204925.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat/conversations")
@RequiredArgsConstructor
@Slf4j
public class ConversationController {

    private final ConversationService conversationService;
    private final DialogflowService dialogflowService;
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    // User tạo phòng chat mới
    // POST /api/chat/conversations
    @PostMapping
    public ResponseEntity<ConversationResponse> createConversation(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody CreateConversationRequest req) {

        String userId = jwt.getSubject();

        // 1. Tạo phòng chat (mặc định ConversationService sẽ lưu lại tin nhắn User)
        ConversationResponse response = conversationService.createConversation(userId, req);

        // 2. NGAY LẬP TỨC phản hồi tin nhắn đầu tiên bằng Bot (vốn bị bỏ lọt)
        if (req.getFirstMessage() != null && !req.getFirstMessage().isBlank()) {
            String firstMsg = req.getFirstMessage().trim();

            try {
                if ("Chat với Admin".equalsIgnoreCase(firstMsg)) {
                    MessageResponse botConfirmMsg = messageService.sendBotMessage(
                            response.getId(),
                            "Đã ngắt kết nối với Bot, Admin sẽ hỗ trợ bạn ngay.",
                            "handoff",
                            1.0,
                            false,
                            null
                    );
                    messagingTemplate.convertAndSend("/topic/conversation." + response.getId(), botConfirmMsg);
                    conversationService.adminJoin(response.getId(), null);
                    messagingTemplate.convertAndSend("/topic/admin.newConversation",
                            conversationService.getById(response.getId()));
                } else {
                    // Lấy sessionId thực thụ của phòng chat
                    String botSessionId = conversationService.findById(response.getId()).getBotSessionId();
                    // Lưu ý: Ta dùng luôn ID của conversation làm SessionId để đồng nhất!

                    DialogflowResponse botResp = dialogflowService.detectIntent(botSessionId, firstMsg);

                    MessageResponse botMsg = messageService.sendBotMessage(
                            response.getId(),
                            botResp.getResponseText(),
                            botResp.getIntent(),
                            botResp.getConfidence(),
                            botResp.getIsFallback(),
                            botResp.getQuickReplies()
                    );

                    conversationService.updateLastMessage(
                            response.getId(),
                            "[Bot]: " + botResp.getResponseText(),
                            SenderRole.BOT
                    );

                    // Đẩy ngược lại WebSocket, frontend sẽ bắt được (hoặc Rest API GET Messages bắt được)
                    messagingTemplate.convertAndSend("/topic/conversation." + response.getId(), botMsg);

                    if (Boolean.TRUE.equals(botResp.getIsFallback())) {
                        conversationService.adminJoin(response.getId(), null);
                        messagingTemplate.convertAndSend("/topic/admin.newConversation",
                                conversationService.getById(response.getId()));
                    }
                }
            } catch (Exception e) {
                log.error("Xử lý lỗi cho tín hiệu Bot đầu tiên: ", e);
                try {
                    conversationService.adminJoin(response.getId(), null);
                    messagingTemplate.convertAndSend("/topic/admin.newConversation",
                            conversationService.getById(response.getId()));
                } catch (Exception ex) {
                    log.error("Failed to fallback first message: ", ex);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // User lấy danh sách conversation của mình
    // GET /api/chat/conversations/my
    @GetMapping("/my")
    public ResponseEntity<List<ConversationResponse>> getMyConversations(
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return ResponseEntity.ok(conversationService.getUserConversations(userId));
    }

    // Lấy 1 conversation theo ID
    // GET /api/chat/conversations/{id}
    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponse> getById(
            @PathVariable String conversationId) {
        return ResponseEntity.ok(conversationService.getById(conversationId));
    }

    // Admin lấy danh sách conversation theo status
    // GET /api/chat/conversations/admin?status=WAITING
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ConversationResponse>> getByStatus(
            @RequestParam(defaultValue = "WAITING") ConversationStatus status) {
        return ResponseEntity.ok(conversationService.getConversationsByStatus(status));
    }

    // Admin/User đóng phòng chat
    @PatchMapping("/{conversationId}/close")
    public ResponseEntity<ConversationResponse> close(
            @PathVariable String conversationId) {
        return ResponseEntity.ok(conversationService.closeConversation(conversationId));
    }

    @PatchMapping("/{conversationId}/read")
    public ResponseEntity<Void> markRead(
            @PathVariable String conversationId,
            @AuthenticationPrincipal Jwt jwt) {

        String role = jwt.getClaimAsString("role");
        if ("admin".equalsIgnoreCase(role)) {
            conversationService.markReadByAdmin(conversationId);
        } else {
            conversationService.markReadByUser(conversationId);
        }
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{conversationId}/pin")
    public ResponseEntity<ConversationResponse> togglePin(@PathVariable String conversationId) {
        return ResponseEntity.ok(conversationService.togglePin(conversationId));
    }

    @PatchMapping("/{conversationId}/mute")
    public ResponseEntity<ConversationResponse> toggleMute(@PathVariable String conversationId) {
        return ResponseEntity.ok(conversationService.toggleMute(conversationId));
    }

    // ── User yêu cầu chuyển sang Admin ─────────────────────────────────────────
    // PATCH /api/chat/conversations/{conversationId}/handoff
    @PatchMapping("/{conversationId}/handoff")
    public ResponseEntity<ConversationResponse> handoffToAdmin(
            @PathVariable String conversationId,
            @AuthenticationPrincipal Jwt jwt) {

        // Gửi system message thông báo cho admin
        MessageResponse sysMsg = messageService.sendBotMessage(
                conversationId,
                "Đã ngắt kết nối với Bot. Admin sẽ hỗ trợ bạn ngay.",
                "handoff", 1.0, false, null
        );
        messagingTemplate.convertAndSend("/topic/conversation." + conversationId, sysMsg);

        // Cập nhật trạng thái → chuyển cho Admin
        ConversationResponse response = conversationService.adminJoin(conversationId, null);

        // Broadcast cập nhật conversation (để frontend user cập nhật state)
        messagingTemplate.convertAndSend("/topic/conversation." + conversationId, response);

        // Thông báo cho Admin panel
        messagingTemplate.convertAndSend("/topic/admin.newConversation", response);

        return ResponseEntity.ok(response);
    }

    // ── User bật lại Bot AI ─────────────────────────────────────────────────────
    // PATCH /api/chat/conversations/{conversationId}/enable-bot
    @PatchMapping("/{conversationId}/enable-bot")
    public ResponseEntity<ConversationResponse> enableBot(
            @PathVariable String conversationId,
            @AuthenticationPrincipal Jwt jwt) {

        ConversationResponse response = conversationService.enableBot(conversationId);

        // Broadcast cập nhật conversation để frontend cập nhật trạng thái ngay
        messagingTemplate.convertAndSend("/topic/conversation." + conversationId, response);

        return ResponseEntity.ok(response);
    }
}
