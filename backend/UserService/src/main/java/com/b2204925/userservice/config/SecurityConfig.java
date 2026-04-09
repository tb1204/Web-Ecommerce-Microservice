package com.b2204925.userservice.config;

import lombok.RequiredArgsConstructor;

import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.beans.factory.annotation.Qualifier;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${clerk.jwks-url}")
    private String jwksUrl;

    private final CustomJwtConverter customJwtConverter;

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(jwksUrl).build();
    }

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate(new HttpComponentsClientHttpRequestFactory());
    }

    @Bean
    public RestTemplate vanillaRestTemplate() {
        return new RestTemplate(new HttpComponentsClientHttpRequestFactory());
    }

    @Bean("simpleRestTemplate")
    public RestTemplate simpleRestTemplate() {
        // Dùng HttpComponentsClientHttpRequestFactory (Apache HttpClient5) thay vì
        // SimpleClientHttpRequestFactory vì SimpleClientHttpRequestFactory không xử lý
        // tốt HTTPS + redirects trong Docker Alpine JRE environment
        org.apache.hc.client5.http.impl.classic.CloseableHttpClient httpClient =
            org.apache.hc.client5.http.impl.classic.HttpClients.custom()
                .setConnectionManager(
                    org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder.create()
                        .setMaxConnTotal(50)
                        .setMaxConnPerRoute(20)
                        .build()
                )
                .build();
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        factory.setConnectTimeout(10000);
        factory.setConnectionRequestTimeout(10000);
        return new RestTemplate(factory);
        // Bean này dùng cho Cloudinary/Slider — KHÔNG dùng @LoadBalanced
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                .accessDeniedHandler(new CustomAccessDeniedHandler())
                )
                .authorizeHttpRequests(auth -> auth
                // ⚠️ Thứ tự CỰC KỲ QUAN TRỌNG: permitAll phải đứng TRƯỚC hasRole
                .requestMatchers("/api/webhook/**").permitAll()
                .requestMatchers("/api/banners/flashsale").permitAll()
                // Cho phép public truy cập slider/banner list (dùng cho Banner, FlashSale)
                .requestMatchers("/api/admin/sliders/list").permitAll()
                .requestMatchers("/api/admin/sliders/banners/**").permitAll()
                .requestMatchers("/api/users/statistics/**").permitAll()
                // Các route /api/admin/** còn lại yêu cầu ADMIN role
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(customJwtConverter))
                );

        return http.build();
    }
}
