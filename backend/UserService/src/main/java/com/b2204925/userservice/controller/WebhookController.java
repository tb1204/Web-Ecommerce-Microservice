//package com.b2204925.userservice.controller;
//
//public class WebhookController {
//}
package com.b2204925.userservice.controller;

import com.b2204925.userservice.entity.User;
import com.b2204925.userservice.repository.UserRepository;
import com.b2204925.userservice.service.ClerkService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class WebhookController {

    private static final Logger logger = LoggerFactory.getLogger(WebhookController.class);

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final ClerkService clerkService;

    @Value("${clerk.webhook-signing-secret}")
    private String signingSecret;

    @PostMapping("/clerk")
    public ResponseEntity<String> handleClerkWebhook(
            @RequestHeader("svix-id") String svixId,
            @RequestHeader("svix-timestamp") String svixTimestamp,
            @RequestHeader("svix-signature") String svixSignature,
            @RequestBody String payload) {

        // 1. Chống replay attack
        try {
            long timestamp = Long.parseLong(svixTimestamp);
            long now = Instant.now().getEpochSecond();
            if (Math.abs(now - timestamp) > 300) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid timestamp");
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid timestamp format");
        }

        // 2. Verify chữ ký
        if (!verifySignature(svixId, svixTimestamp, payload, svixSignature)) {
            logger.warn("Webhook signature invalid");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
        }

        // 3. Xử lý event
        try {
            JsonNode event = objectMapper.readTree(payload);
            String eventType = event.path("type").asText();
            JsonNode data = event.path("data");
            String clerkUserId = data.path("id").asText();

            logger.info("Webhook event: {} | clerkId: {}", eventType, clerkUserId);

            switch (eventType) {
                case "user.created", "user.updated" ->
                    handleUserUpsert(clerkUserId, data);
                case "user.deleted" ->
                    handleUserDeleted(clerkUserId);
                default ->
                    logger.info("Webhook: ignored event {}", eventType);
            }

            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            logger.error("Webhook processing error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    private void handleUserUpsert(String clerkUserId, JsonNode data) {
        User mapped = mapClerkDataToUser(data);
        mapped.setClerkId(clerkUserId);

        Optional<User> existingOpt = userRepository.findByClerkId(clerkUserId);
        if (existingOpt.isPresent()) {
            User existing = existingOpt.get();
            // Chỉ cập nhật field từ Clerk, KHÔNG ghi đè isActive / isBlocked / roles
            existing.setEmail(mapped.getEmail());
            existing.setFirstName(mapped.getFirstName());
            existing.setLastName(mapped.getLastName());
            // existing.setUsername(mapped.getUsername());
            // fix user thay đổi username
            // if (mapped.getUsername() != null && !mapped.getUsername().isBlank()) {
            //     existing.setUsername(mapped.getUsername());
            // }
            existing.setPhone(mapped.getPhone());
            existing.setGender(mapped.getGender());
            existing.setAvatarUrl(mapped.getAvatarUrl());
            existing.setProvider(mapped.getProvider());
            existing.setUpdatedAt(Instant.now());
            userRepository.save(existing);
            logger.info("Webhook: updated user {}", clerkUserId);
        } else {
            mapped.setCreatedAt(Instant.now());
            mapped.setUpdatedAt(Instant.now());
            userRepository.save(mapped);

            // ✅ Thêm dòng này: set role mặc định USER cho user tự đăng ký
            clerkService.updatePublicMetadata(clerkUserId, "user");
            logger.info("Webhook: created user {} and set default role=user", clerkUserId);
        }
    }

    private void handleUserDeleted(String clerkUserId) {
        if (userRepository.existsByClerkId(clerkUserId)) {
            userRepository.deleteByClerkId(clerkUserId);
            logger.info("Webhook: deleted user {}", clerkUserId);
        }
    }

    private String getJsonText(JsonNode node, String fieldName) {
        JsonNode fieldNode = node.path(fieldName);
        if (fieldNode.isMissingNode() || fieldNode.isNull()) {
            return null;
        }
        return fieldNode.asText(null);
    }

    private User mapClerkDataToUser(JsonNode data) {
        User user = new User();

        // ── EMAIL ────────────────────────────────────────────────────────
        JsonNode emails = data.path("email_addresses");
        if (emails.isArray() && !emails.isEmpty()) {
            user.setEmail(getJsonText(emails.get(0), "email_address"));
        }

        // ── EXTERNAL ACCOUNTS (Google / Facebook) ────────────────────────
        JsonNode externalAccounts = data.path("external_accounts");
        String provider = "clerk"; // fallback (không dùng trong case của bạn)

        if (externalAccounts.isArray() && !externalAccounts.isEmpty()) {
            JsonNode extAccount = externalAccounts.get(0);
            String extProvider = getJsonText(extAccount, "provider");

            if (extProvider != null) {
                if (extProvider.contains("google")) {
                    provider = "google";
                } else if (extProvider.contains("facebook")) {
                    provider = "facebook";
                }
            }

            // Avatar: ưu tiên từ external account (URL gốc, chất lượng cao hơn)
            String extAvatar = getJsonText(extAccount, "avatar_url");
            if (extAvatar != null && !extAvatar.isBlank()) {
                user.setAvatarUrl(extAvatar);
            } else {
                user.setAvatarUrl(getJsonText(data, "image_url"));
            }

        } else {
            user.setAvatarUrl(getJsonText(data, "image_url"));
        }

        // ── CÁC FIELD CƠ BẢN ────────────────────────────────────────────
        user.setFirstName(getJsonText(data, "first_name"));
        user.setLastName(getJsonText(data, "last_name"));
        user.setGender(getJsonText(data, "gender")); // thường null với OAuth

        // Username: Clerk OAuth thường null → fallback sang email prefix
        String username = getJsonText(data, "username");
        // if (username == null && user.getEmail() != null) { fix sửa username
        //     username = user.getEmail().split("@")[0];
        // }
        user.setUsername(username);

        // Phone: thường null với OAuth
        JsonNode phones = data.path("phone_numbers");
        if (phones.isArray() && !phones.isEmpty()) {
            user.setPhone(getJsonText(phones.get(0), "phone_number"));
        }

        // ── PROVIDER & DEFAULT FLAGS ─────────────────────────────────────
        user.setProvider(provider);
        user.setRoles(new ArrayList<>(List.of("USER")));
        user.setIsActive(true);
        user.setIsBlocked(false);

        return user;
    }

    private boolean verifySignature(String svixId, String svixTimestamp, String payload, String svixSignature) {
        try {
            String cleanSecret = signingSecret.replace("whsec_", "").trim();
            byte[] keyBytes = Base64.getDecoder().decode(cleanSecret);
            String toSign = svixId + "." + svixTimestamp + "." + payload;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keyBytes, "HmacSHA256"));
            String expectedHash = Base64.getEncoder()
                    .encodeToString(mac.doFinal(toSign.getBytes(StandardCharsets.UTF_8)));

            for (String part : svixSignature.split(" ")) {
                String[] kv = part.split(",");
                if (kv.length == 2 && kv[1].equals(expectedHash)) {
                    return true;
                }
            }
            return false;
        } catch (NoSuchAlgorithmException | InvalidKeyException | IllegalArgumentException e) {
            logger.error("Signature verify error: ", e);
            return false;
        }
    }
}

// private User mapClerkDataToUser(JsonNode data) {
//     User user = new User();
//     JsonNode emails = data.path("email_addresses");
//     if (emails.isArray() && !emails.isEmpty()) {
//         user.setEmail(emails.get(0).path("email_address").asText());
//     }
//     user.setFirstName(data.path("first_name").asText(null));
//     user.setLastName(data.path("last_name").asText(null));
//     user.setUsername(data.path("username").asText(null));
//     user.setAvatarUrl(data.path("image_url").asText(null));
//     user.setGender(data.path("gender").asText(null));
//     JsonNode phones = data.path("phone_numbers");
//     if (phones.isArray() && !phones.isEmpty()) {
//         user.setPhone(phones.get(0).path("phone_number").asText());
//     }
//     user.setRoles(new ArrayList<>(List.of("USER")));
//     user.setProvider("clerk");
//     user.setIsActive(true);
//     user.setIsBlocked(false);
//     return user;
    // }
