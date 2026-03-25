package com.b2204925.chatservice.controller;

import com.b2204925.chatservice.dto.req.CreateConversationRequest;
import com.b2204925.chatservice.dto.res.ConversationResponse;
import com.b2204925.chatservice.entity.ConversationStatus;
import com.b2204925.chatservice.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    // User tạo phòng chat mới
    // POST /api/chat/conversations
    @PostMapping
    public ResponseEntity<ConversationResponse> createConversation(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody CreateConversationRequest req) {

        String userId = jwt.getSubject();
        ConversationResponse response = conversationService.createConversation(userId, req);
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
    // PATCH /api/chat/conversations/{id}/close
    @PatchMapping("/{conversationId}/close")
    public ResponseEntity<ConversationResponse> close(
            @PathVariable String conversationId) {

        return ResponseEntity.ok(conversationService.closeConversation(conversationId));
    }
    // PATCH /api/chat/conversations/{id}/read

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
}
