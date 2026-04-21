package com.b2204925.userservice.service;

import com.b2204925.userservice.dto.CreateClerkUserRequest;
import com.b2204925.userservice.exception.AppException;
import com.b2204925.userservice.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Tập trung tất cả logic gọi Clerk API vào đây. Controller không gọi Clerk trực
 * tiếp nữa.
 */
@Service
public class ClerkService {

    private static final Logger logger = LoggerFactory.getLogger(ClerkService.class);

    private final RestTemplate vanillaRestTemplate;

    public ClerkService(@Qualifier("vanillaRestTemplate") RestTemplate vanillaRestTemplate) {
        this.vanillaRestTemplate = vanillaRestTemplate;
    }

    @Value("${clerk.secret-key}")
    private String clerkSecretKey;

    @Value("${clerk.api-url}")
    private String clerkApiUrl;

    // ─── Helper ───────────────────────────────────────────────────────────────
    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + clerkSecretKey);
        return headers;
    }

    public void updatePublicMetadata(String clerkId, String role) {
        HttpHeaders headers = authHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // ✅ Clerk dùng endpoint /users/{id} với PATCH, không phải /metadata
        Map<String, Object> body = Map.of(
                "public_metadata", Map.of("role", role.toLowerCase())
        );

        try {
            ResponseEntity<String> response = vanillaRestTemplate.exchange(
                    clerkApiUrl + "/users/" + clerkId, // ← bỏ /metadata
                    HttpMethod.PATCH,
                    new HttpEntity<>(body, headers),
                    String.class
            );
            logger.info("Updated public_metadata OK for {}: {}", clerkId, response.getBody());
        } catch (Exception e) {
            logger.error("Failed to update public_metadata for {}: {}", clerkId, e.getMessage());
            throw new AppException(ErrorCode.CLERK_SYNC_FAILED, e.getMessage());
        }
    }

    private void postToClerk(String path, ErrorCode errorOnFail) {
        try {
            vanillaRestTemplate.exchange(
                    clerkApiUrl + path,
                    HttpMethod.POST,
                    new HttpEntity<>(authHeaders()),
                    Void.class
            );
            logger.info("Clerk POST {} OK", path);
        } catch (Exception e) {
            logger.error("Clerk POST {} failed: {}", path, e.getMessage());
            throw new AppException(errorOnFail, e.getMessage());
        }
    }

    public String createUser(CreateClerkUserRequest request) {
        HttpHeaders headers = authHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("email_address", List.of(request.getEmail()));
        body.put("password", request.getPassword());
        body.put("first_name", request.getFirstName());
        body.put("last_name", request.getLastName());
        body.put("username", request.getUsername());// tắt ko gửi lên clerk

        // ✅ Set role vào public_metadata ngay lúc tạo
        String role = request.getRoles() != null && request.getRoles().contains("ADMIN")
                ? "admin" : "user";
        body.put("public_metadata", Map.of("role", role));

        try {
            ResponseEntity<Map> response = vanillaRestTemplate.postForEntity(
                    clerkApiUrl + "/users",
                    new HttpEntity<>(body, headers),
                    Map.class
            );
            Map<String, Object> clerkData = response.getBody();
            if (clerkData == null || !clerkData.containsKey("id")) {
                throw new AppException(ErrorCode.CLERK_CREATE_FAILED, "Response missing user ID");
            }
            String clerkId = (String) clerkData.get("id");
            logger.info("Clerk user created: {} with role: {}", clerkId, role);
            return clerkId;
        } catch (AppException ex) {
            throw ex;
        } catch (HttpStatusCodeException ex) {
            logger.error("Clerk API returned error: {} - {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new AppException(ErrorCode.CLERK_CREATE_FAILED, "Lỗi từ Clerk: " + ex.getResponseBodyAsString());
        } catch (Exception e) {
            logger.error("Create Clerk user failed: {}", e.getMessage());
            throw new AppException(ErrorCode.CLERK_CREATE_FAILED, e.getMessage());
        }
    }


    public void deleteUser(String clerkUserId) {
        String url = "https://api.clerk.com/v1/users/" + clerkUserId;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(clerkSecretKey);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            // Dùng String.class thay Void.class vì Clerk trả body JSON {"deleted":true}
            // Void.class khiến RestTemplate fail khi parse response body
            vanillaRestTemplate.exchange(url, HttpMethod.DELETE, request, String.class);
            logger.info("Clerk user deleted: {}", clerkUserId);
        } catch (HttpStatusCodeException ex) {
            // 404: user đã bị xóa trước đó trên Clerk → bỏ qua, vẫn xóa DB
            if (ex.getStatusCode().value() == 404) {
                logger.warn("Clerk user {} not found (may already be deleted), skipping Clerk delete", clerkUserId);
            } else {
                logger.error("Clerk delete user {} failed: {} - {}", clerkUserId, ex.getStatusCode(), ex.getResponseBodyAsString());
                throw new AppException(ErrorCode.CLERK_SYNC_FAILED, "Clerk delete failed: " + ex.getResponseBodyAsString());
            }
        } catch (Exception e) {
            logger.error("Clerk delete user {} unexpected error: {}", clerkUserId, e.getMessage());
            throw new AppException(ErrorCode.CLERK_SYNC_FAILED, e.getMessage());
        }
    }

    public void banUser(String clerkId) {
        postToClerk("/users/" + clerkId + "/ban", ErrorCode.CLERK_BAN_FAILED);
    }

    public void unbanUser(String clerkId) {
        postToClerk("/users/" + clerkId + "/unban", ErrorCode.CLERK_UNBAN_FAILED);
    }

    public void lockUser(String clerkId) {
        postToClerk("/users/" + clerkId + "/lock", ErrorCode.CLERK_LOCK_FAILED);
    }

    public void unlockUser(String clerkId) {
        postToClerk("/users/" + clerkId + "/unlock", ErrorCode.CLERK_UNLOCK_FAILED);
    }
}
