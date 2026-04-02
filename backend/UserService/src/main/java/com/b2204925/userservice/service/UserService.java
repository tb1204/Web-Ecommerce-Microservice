package com.b2204925.userservice.service;

import com.b2204925.userservice.dto.UserUpdateDto;
import com.b2204925.userservice.entity.User;
import com.b2204925.userservice.exception.AppException;
import com.b2204925.userservice.exception.ErrorCode;
import com.b2204925.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpMethod;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    // ─── Queries ──────────────────────────────────────────────────────────────
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserProfile(String clerkId) {
        return userRepository.findByClerkId(clerkId);
    }

    public User getUserOrThrow(String clerkId) {
        return userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    // ─── Create ───────────────────────────────────────────────────────────────
    public User createUser(User user) {
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    /**
     * Lấy user hiện tại từ JWT. Nếu chưa tồn tại (webhook chưa kịp sync) thì
     * tạo mới.
     */
    public User getOrCreateCurrentUser(Jwt jwt) {
        String clerkId = jwt.getSubject();
        return getUserProfile(clerkId).orElseGet(() -> {
            User newUser = User.builder()
                    .clerkId(clerkId)
                    .email(jwt.getClaimAsString("email"))
                    .firstName(jwt.getClaimAsString("first_name"))
                    .lastName(jwt.getClaimAsString("last_name"))
                    .roles(List.of("USER"))
                    .isActive(true)
                    .isBlocked(false)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            return userRepository.save(newUser);
        });
    }

    // ─── Update profile (user tự cập nhật) ───────────────────────────────────
    public User updateUserProfile(String clerkId, UserUpdateDto dto) {
        User user = getUserOrThrow(clerkId);
        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
        }
        if (dto.getGender() != null) {
            user.setGender(dto.getGender());
        }
        if (dto.getAvatarUrl() != null) {
            user.setAvatarUrl(dto.getAvatarUrl());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    // ─── Delete ───────────────────────────────────────────────────────────────
    public void deleteUser(String clerkId) {
        userRepository.deleteByClerkId(clerkId);
    }

    // ─── Ban / Unban (isActive) ───────────────────────────────────────────────
    public void banUser(String clerkId) {
        User user = getUserOrThrow(clerkId);
        user.setIsActive(false);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    public void unbanUser(String clerkId) {
        User user = getUserOrThrow(clerkId);
        user.setIsActive(true);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    // ─── Lock / Unlock (isBlocked) ────────────────────────────────────────────
    public void lockUser(String clerkId) {
        User user = getUserOrThrow(clerkId);
        user.setIsBlocked(true);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    public void unlockUser(String clerkId) {
        User user = getUserOrThrow(clerkId);
        user.setIsBlocked(false);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    // ================== WISHLIST - GỌI PRODUCT-SERVICE LẤY FULL PRODUCT ==================
    // public List<Map<String, Object>> getWishlist(String clerkId) {
    //     User user = getUserOrThrow(clerkId);
    //     List<String> productIds = user.getWishlist() != null ? user.getWishlist() : new ArrayList<>();
    //     if (productIds.isEmpty()) {
    //         return new ArrayList<>();
    //     }
    //     try {
    //         String idsParam = String.join(",", productIds);
    //         String url = "http://localhost:9001/api/products/by-ids?ids=" + idsParam;
    //         ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
    //                 url,
    //                 HttpMethod.GET,
    //                 null,
    //                 new ParameterizedTypeReference<List<Map<String, Object>>>() {}
    //         );
    //         return response.getBody() != null ? response.getBody() : new ArrayList<>();
    //     } catch (Exception e) {
    //         log.error("Lỗi khi gọi Product Service lấy wishlist cho user {}: {}", clerkId, e.getMessage());
    //         return new ArrayList<>();
    //     }
    // }
    public List<Map<String, Object>> getWishlist(String clerkId) {
        User user = getUserOrThrow(clerkId);
        List<String> productIds = user.getWishlist() != null ? user.getWishlist() : new ArrayList<>();

        if (productIds.isEmpty()) {
            return new ArrayList<>();
        }

        try {
            String idsParam = String.join(",", productIds);
            String url = "http://localhost:8082/api/products/by-ids?ids=" + idsParam;

            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url, HttpMethod.GET, null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {
            }
            );

            List<Map<String, Object>> products = response.getBody();
            if (products == null) {
                return new ArrayList<>();
            }

            // ✅ Map _id → id để frontend dùng được
            return products.stream().map(p -> {
                Map<String, Object> mapped = new java.util.HashMap<>(p);
                if (mapped.containsKey("_id") && !mapped.containsKey("id")) {
                    mapped.put("id", mapped.get("_id"));
                }
                return mapped;
            }).collect(java.util.stream.Collectors.toList());

        } catch (Exception e) {
            log.error("Lỗi gọi Product Service cho wishlist user {}: {}", clerkId, e.getMessage());
            return new ArrayList<>();
        }
    }

    public List<String> addToWishlist(String clerkId, String productId) {
        User user = getUserOrThrow(clerkId);

        if (user.getWishlist() == null) {
            user.setWishlist(new ArrayList<>());
        }

        if (!user.getWishlist().contains(productId)) {
            user.getWishlist().add(productId);
            user.setUpdatedAt(Instant.now());
            userRepository.save(user);
        }
        return user.getWishlist();
    }

    public List<String> removeFromWishlist(String clerkId, String productId) {
        User user = getUserOrThrow(clerkId);

        if (user.getWishlist() != null) {
            user.getWishlist().remove(productId);
            user.setUpdatedAt(Instant.now());
            userRepository.save(user);
        }
        return user.getWishlist() != null ? user.getWishlist() : new ArrayList<>();
    }
}
