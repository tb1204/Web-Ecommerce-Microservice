package com.b2204925.chatservice.controller;

import com.b2204925.chatservice.dto.res.MessageResponse;
import com.b2204925.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // Lấy toàn bộ lịch sử tin nhắn trong 1 phòng
    // GET /api/chat/messages/{conversationId}
    @GetMapping("/{conversationId}")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable String conversationId) {

        return ResponseEntity.ok(messageService.getMessages(conversationId));
    }

    // Lấy tin nhắn có phân trang (load thêm tin cũ)
    // GET /api/chat/messages/{conversationId}/paged?page=0&size=20
    @GetMapping("/{conversationId}/paged")
    public ResponseEntity<Page<MessageResponse>> getMessagesPaged(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(messageService.getMessagesPaged(conversationId, page, size));
    }

    // Xóa mềm tin nhắn
    // DELETE /api/chat/messages/{messageId}
    @DeleteMapping("/{messageId}")
    public ResponseEntity<MessageResponse> deleteMessage(
            @PathVariable String messageId,
            @AuthenticationPrincipal Jwt jwt) {

        String requesterId = jwt.getSubject();
        return ResponseEntity.ok(messageService.deleteMessage(messageId, requesterId));
    }
}
