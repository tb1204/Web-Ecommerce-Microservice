package com.b2204925.chatservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        // /topic = broadcast (1 → nhiều người)
        // /queue = private (1 → 1 người)

        registry.setApplicationDestinationPrefixes("/app");
        // Frontend gửi message đến: /app/chat.send
        // Backend nhận qua @MessageMapping("/chat.send")

        registry.setUserDestinationPrefix("/user");
        // Gửi private message đến user cụ thể:
        // /user/{userId}/queue/messages
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                // Frontend kết nối WebSocket tại: ws://localhost:8086/ws
                .setAllowedOriginPatterns("*")
                .withSockJS();
        // SockJS = fallback nếu browser không hỗ trợ WebSocket thuần
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketAuthInterceptor);
        // Interceptor kiểm tra JWT khi kết nối WebSocket
    }
}
