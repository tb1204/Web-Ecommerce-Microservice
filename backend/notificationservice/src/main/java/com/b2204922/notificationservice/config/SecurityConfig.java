package com.b2204922.notificationservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // BẮT BUỘC phải disable CSRF thì SockJS mới kết nối được
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/ws-notifications/**").permitAll() // Cho phép đi qua không cần Token
                        .requestMatchers("/api/notifications/**").permitAll() // Cho phép Postman/Frontend gọi API
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}
