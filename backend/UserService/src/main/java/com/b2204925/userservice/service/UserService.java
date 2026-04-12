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
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
// import org.springframework.core.ParameterizedTypeReference;
import com.b2204925.userservice.service.ClerkService;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpMethod;
import java.time.Instant;
import java.time.LocalDateTime;
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
    private final ClerkService clerkService;

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

    //membership
    public void addSpending(String clerkId, double amount) {
    User user = getUserOrThrow(clerkId);
    user.addOrder(amount);   // đã tăng purchaseCount + totalSpent + updateMembership()
    user.setUpdatedAt(Instant.now());
    userRepository.save(user);
    log.info("User {} | +{}đ | Hạng mới: {}", clerkId, amount, user.getMembership());
}


    // ─── Update profile (user tự cập nhật) ───────────────────────────────────
    public User updateUserProfile(String clerkId, UserUpdateDto dto) {
        User user = getUserOrThrow(clerkId);
        log.info("=== updateUserProfile called: clerkId={}, username={}, firstName={}",
                clerkId, dto.getUsername(), dto.getFirstName());
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
        if (dto.getUsername() != null) {
            user.setUsername(dto.getUsername());
        }
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    // // ─── Delete ───────────────────────────────────────────────────────────────
    // public void deleteUser(String clerkId) {
    //     userRepository.deleteByClerkId(clerkId);
    // }
    public void deleteUser(String clerkId) {

        // 1. Xóa trên Clerk
        clerkService.deleteUser(clerkId);

        // 2. Xóa DB (hoặc để webhook lo)
        userRepository.deleteByClerkId(clerkId);

        log.info("Deleted user: {}", clerkId);
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

            //gọi qua eruka 
            String url = "http://product-service/api/products/by-ids?ids=" + idsParam;
            // String url = "http://localhost:8082/api/products/by-ids?ids=" + idsParam;  gọi local

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

    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getNewUsersCount() {
        // Tính khách mới trong vòng 7 ngày qua
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(7);
        return userRepository.countByCreatedAtAfter(thirtyDaysAgo);
    }

    // ================== ADDRESS MANAGEMENT ==================
    /**
     * Thêm địa chỉ mới (tối đa 4 địa chỉ/user). Nếu là địa chỉ đầu tiên thì tự
     * động set default.
     */
    public List<com.b2204925.userservice.entity.Address> addAddress(
            String clerkId,
            com.b2204925.userservice.entity.Address address) {

        User user = getUserOrThrow(clerkId);
        if (user.getAddresses() == null) {
            user.setAddresses(new ArrayList<>());
        }
        if (user.getAddresses().size() >= 4) {
            throw new RuntimeException("Tối đa 4 địa chỉ mỗi tài khoản.");
        }
        address.setId(java.util.UUID.randomUUID().toString());
        if (user.getAddresses().isEmpty()) {
            address.setDefaultAddress(true);
        }
        user.getAddresses().add(address);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        return user.getAddresses();
    }

    /**
     * Xoá địa chỉ theo id. Nếu xoá địa chỉ default thì set địa chỉ đầu tiên còn
     * lại làm default.
     */
    public List<com.b2204925.userservice.entity.Address> removeAddress(
            String clerkId, String addressId) {

        User user = getUserOrThrow(clerkId);
        boolean wasDefault = user.getAddresses().stream()
                .anyMatch(a -> addressId.equals(a.getId()) && a.isDefaultAddress());
        user.getAddresses().removeIf(a -> addressId.equals(a.getId()));
        if (wasDefault && !user.getAddresses().isEmpty()) {
            user.getAddresses().get(0).setDefaultAddress(true);
        }
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        return user.getAddresses();
    }

    /**
     * Set địa chỉ mặc định theo id.
     */
    public List<com.b2204925.userservice.entity.Address> setDefaultAddress(
            String clerkId, String addressId) {

        User user = getUserOrThrow(clerkId);
        user.getAddresses().forEach(a -> a.setDefaultAddress(addressId.equals(a.getId())));
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        return user.getAddresses();
    }

    /**
     * Lưu địa chỉ từ Checkout. - Chỉ lưu nếu chưa có địa chỉ trùng (street +
     * province) và chưa đủ 4. - Cập nhật phone nếu user chưa có.
     */
    public User saveCheckoutAddress(
            String clerkId,
            com.b2204925.userservice.entity.Address address,
            String phone) {

        User user = getUserOrThrow(clerkId);

        // Cập nhật phone nếu chưa có
        if ((user.getPhone() == null || user.getPhone().isBlank())
                && phone != null && !phone.isBlank()) {
            user.setPhone(phone);
        }

        // Kiểm tra xem địa chỉ đã tồn tại chưa (theo street + province)
        boolean exists = user.getAddresses().stream().anyMatch(a
                -> address.getStreet() != null
                && address.getStreet().equalsIgnoreCase(a.getStreet())
                && address.getProvince() != null
                && address.getProvince().equalsIgnoreCase(a.getProvince()));

        if (!exists && user.getAddresses().size() < 4) {
            address.setId(java.util.UUID.randomUUID().toString());
            if (user.getAddresses().isEmpty()) {
                address.setDefaultAddress(true);
            }
            user.getAddresses().add(address);
        }

        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        return user;
    }
}
