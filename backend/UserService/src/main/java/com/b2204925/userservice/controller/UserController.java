package com.b2204925.userservice.controller;

import com.b2204925.userservice.dto.UserUpdateDto;
import com.b2204925.userservice.entity.User;
import com.b2204925.userservice.service.UserService;
import lombok.RequiredArgsConstructor;

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
}
