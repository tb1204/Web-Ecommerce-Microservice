package com.b2204925.userservice.controller;

import com.b2204925.userservice.dto.UserUpdateDto;
import com.b2204925.userservice.entity.User;
import com.b2204925.userservice.service.UserService;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users/me
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(userService.getOrCreateCurrentUser(jwt));
    }

    // PUT /api/users/me
    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UserUpdateDto dto) {
        return ResponseEntity.ok(userService.updateUserProfile(jwt.getSubject(), dto));
    }

 // ================== WISHLIST ENDPOINTS ==================

// GET /api/users/me/wishlist  → trả về full thông tin sản phẩm
@GetMapping("/me/wishlist")
public ResponseEntity<List<Map<String, Object>>> getWishlist(
        @AuthenticationPrincipal Jwt jwt) {
    return ResponseEntity.ok(userService.getWishlist(jwt.getSubject()));
}

// POST /api/users/me/wishlist/{productId}  → vẫn trả về List<String> (IDs)
@PostMapping("/me/wishlist/{productId}")
public ResponseEntity<List<String>> addToWishlist(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable String productId) {
    return ResponseEntity.ok(userService.addToWishlist(jwt.getSubject(), productId));
}

// DELETE /api/users/me/wishlist/{productId} → vẫn trả về List<String> (IDs)
@DeleteMapping("/me/wishlist/{productId}")
public ResponseEntity<List<String>> removeFromWishlist(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable String productId) {
    return ResponseEntity.ok(userService.removeFromWishlist(jwt.getSubject(), productId));
}
    // POST /api/users/logout
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout thành công từ phía client.");
    }

    //Tong khach hang
    @GetMapping("/statistics/user-counts")
    public ResponseEntity<Map<String, Long>> getUserStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userService.getTotalUsers());
        stats.put("newUsers", userService.getNewUsersCount());
        return ResponseEntity.ok(stats);
    }

    // ================== ADDRESS ENDPOINTS ==================

    /** POST /api/users/me/addresses — Thêm địa chỉ mới (max 4) */
    @PostMapping("/me/addresses")
    public ResponseEntity<?> addAddress(
            @AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt,
            @RequestBody com.b2204925.userservice.entity.Address address) {
        try {
            return ResponseEntity.ok(userService.addAddress(jwt.getSubject(), address));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** DELETE /api/users/me/addresses/{addressId} — Xoá địa chỉ theo id */
    @DeleteMapping("/me/addresses/{addressId}")
    public ResponseEntity<List<com.b2204925.userservice.entity.Address>> removeAddress(
            @AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt,
            @PathVariable String addressId) {
        return ResponseEntity.ok(userService.removeAddress(jwt.getSubject(), addressId));
    }

    /** PUT /api/users/me/addresses/{addressId}/default — Set địa chỉ mặc định */
    @PutMapping("/me/addresses/{addressId}/default")
    public ResponseEntity<List<com.b2204925.userservice.entity.Address>> setDefaultAddress(
            @AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt,
            @PathVariable String addressId) {
        return ResponseEntity.ok(userService.setDefaultAddress(jwt.getSubject(), addressId));
    }

    /**
     * POST /api/users/me/save-checkout-address
     * Lưu địa chỉ sau khi đặt hàng thành công.
     * Body: { address: {...}, phone: "..." }
     */
    @PostMapping("/me/save-checkout-address")
    public ResponseEntity<User> saveCheckoutAddress(
            @AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt,
            @RequestBody Map<String, Object> body) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, String> addrMap = (Map<String, String>) body.get("address");
            String phone = (String) body.get("phone");

            com.b2204925.userservice.entity.Address address =
                    new com.b2204925.userservice.entity.Address();
            if (addrMap != null) {
                address.setReceiverName(addrMap.get("receiverName"));
                address.setPhone(addrMap.get("phone"));
                address.setStreet(addrMap.get("street"));
                address.setWard(addrMap.get("ward"));
                address.setDistrict(addrMap.get("district"));
                address.setProvince(addrMap.get("province"));
            }

            return ResponseEntity.ok(
                    userService.saveCheckoutAddress(jwt.getSubject(), address, phone));
        } catch (Exception e) {
            // Không block flow chính — trả 200 dù có lỗi phụ
            return ResponseEntity.ok(userService.getOrCreateCurrentUser(jwt));
        }
    }

}

