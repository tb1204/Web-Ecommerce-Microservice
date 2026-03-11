//package com.b2204925.cartservice.controller;
//
//public class CartController {
//}
// ═══════════════════════════════════════════════════════
// CONTROLLER
// ═══════════════════════════════════════════════════════
// controller/CartController.java
package com.b2204925.cartservice.controller;

import com.b2204925.cartservice.dto.req.*;
import com.b2204925.cartservice.dto.res.CartResponse;
import com.b2204925.cartservice.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // GET /api/cart
    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(cartService.getCart(jwt.getSubject()));
    }

    // POST /api/cart/items
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody AddToCartRequest req) {
        return ResponseEntity.ok(cartService.addItem(jwt.getSubject(), req));
    }

    // PATCH /api/cart/items
    @PatchMapping("/items")
    public ResponseEntity<CartResponse> updateQuantity(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateQuantityRequest req) {
        return ResponseEntity.ok(cartService.updateQuantity(jwt.getSubject(), req));
    }

    // DELETE /api/cart/items/{productId}/{variantId}
    @DeleteMapping("/items/{productId}/{variantId}")
    public ResponseEntity<CartResponse> removeItem(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String productId,
            @PathVariable String variantId) {
        return ResponseEntity.ok(cartService.removeItem(jwt.getSubject(), productId, variantId));
    }

    // DELETE /api/cart/checkout-items — xóa item sau khi thanh toán thành công
    @DeleteMapping("/checkout-items")
    public ResponseEntity<CartResponse> removeCheckedOutItems(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CheckoutItemsRequest req) {
        return ResponseEntity.ok(cartService.removeCheckedOutItems(jwt.getSubject(), req));
    }

    // DELETE /api/cart — xóa toàn bộ giỏ hàng
    @DeleteMapping
    public ResponseEntity<CartResponse> clearCart(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(cartService.clearCart(jwt.getSubject()));
    }
}
