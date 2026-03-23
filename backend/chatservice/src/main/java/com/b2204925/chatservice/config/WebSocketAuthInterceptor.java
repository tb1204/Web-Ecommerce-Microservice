package com.b2204925.chatservice.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtDecoder jwtDecoder;
    private final CustomJwtConverter customJwtConverter;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                message, StompHeaderAccessor.class
        );

        // Chỉ kiểm tra khi CONNECT (lúc kết nối WebSocket lần đầu)
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            // Frontend gửi: Authorization: Bearer <token>

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // Cắt bỏ "Bearer " lấy token

                try {
                    var jwt = jwtDecoder.decode(token);
                    // Verify token

                    var authentication = customJwtConverter.convert(jwt);
                    accessor.setUser(authentication);
                    // Lưu authentication vào WebSocket session
                    // Dùng để biết user nào đang kết nối

                    log.info("WebSocket connected: {}", jwt.getSubject());
                } catch (JwtException e) {
                    log.warn("WebSocket JWT invalid: {}", e.getMessage());
                    throw new IllegalArgumentException("Token không hợp lệ");
                }
            }
        }
        return message;
    }
}
