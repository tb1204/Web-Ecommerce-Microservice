//package com.b2204925.cartservice.service;
//
//public class CartServiceImpl {
//}
// service/impl/CartServiceImpl.java
package com.b2204925.cartservice.service;

import com.b2204925.cartservice.dto.req.AddToCartRequest;
import com.b2204925.cartservice.dto.req.CheckoutItemsRequest;
import com.b2204925.cartservice.dto.req.UpdateQuantityRequest;
import com.b2204925.cartservice.dto.req.*;
import com.b2204925.cartservice.dto.res.CartItemResponse;
import com.b2204925.cartservice.dto.res.CartResponse;
import com.b2204925.cartservice.entity.Cart;
import com.b2204925.cartservice.entity.CartItem;
import com.b2204925.cartservice.entity.CartSummary;
import com.b2204925.cartservice.exception.AppException;
import com.b2204925.cartservice.exception.ErrorCode;
import com.b2204925.cartservice.repository.CartRepository;
import com.b2204925.cartservice.service.CartService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    private final RestTemplate restTemplate;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository,
            @Qualifier("loadBalancedRestTemplate") RestTemplate restTemplate) {
        this.cartRepository = cartRepository;
        this.restTemplate = restTemplate;
    }

    // ── Map entity → response ────────────────────────────────────────
    private CartItemResponse toItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .productId(item.getProductId())
                .variantId(item.getVariantId())
                .name(item.getName())
                .image(item.getImage())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .lineTotal(item.getLineTotal())
                // .subtotal(item.getPrice() * item.getQuantity())
                .size(item.getSize())
                .thickness(item.getThickness())
                .color(item.getColor())
                .build();
    }

    private CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems()
                .stream()
                .map(this::toItemResponse)
                .toList();

        int totalQty = cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        double subtotal = cart.getItems().stream()
                .mapToDouble(CartItem::getLineTotal).sum();

        // double totalPrice = cart.getItems().stream()
        //         .mapToDouble(i -> i.getPrice() * i.getQuantity())
        //         .sum();
        CartSummary summary = CartSummary.builder()
                .subtotal(subtotal)
                .shippingThreshold(3_000_000)
                .totalQty(totalQty)
                .build();
        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(itemResponses)
                .summary(summary)
                .note(cart.getNote())
                .status(cart.getStatus())
                .build();
    }

    // ── Lấy hoặc tạo mới cart ────────────────────────────────────────
    private Cart getOrCreateCart(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(
                Cart.builder().userId(userId).build()
        ));
    }

    // ── GET cart ─────────────────────────────────────────────────────
    @Override
    public CartResponse getCart(String userId) {
        return toCartResponse(getOrCreateCart(userId));
    }

    //code đúng gọi tới productservice 
    // ── ADD item ─────────────────────────────────────────────────────
//     @Override
//     public CartResponse addItem(String userId, AddToCartRequest req) {
//         // Gọi product-service qua Eureka
//         Map<String, Object> product;
//         try {
//             product = restTemplate.getForObject(
//                     "http://productservice/api/products/" + req.getProductId(),
//                     Map.class);
//         } catch (RestClientException e) {
//             throw new AppException(ErrorCode.PRODUCT_SERVICE_ERROR);
//         }
//         if (product == null) {
//             throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
//         }
//         // Tìm variant
//         List<Map<String, Object>> variants =
//                 (List<Map<String, Object>>) product.get("variants");
//         Map<String, Object> variant = variants.stream()
//                 .filter(v -> req.getVariantId().equals(v.get("id")))
//                 .findFirst()
//                 .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
//         Cart cart = getOrCreateCart(userId);
//         List<CartItem> items = cart.getItems();
//         // Nếu đã có cùng productId + variantId → tăng số lượng
//         CartItem existing = items.stream()
//                 .filter(i -> i.getProductId().equals(req.getProductId())
//                         && i.getVariantId().equals(req.getVariantId()))
//                 .findFirst()
//                 .orElse(null);
//         if (existing != null) {
//               existing.setQuantity(existing.getQuantity() + req.getQuantity());
//               existing.setLineTotal(existing.getPrice() * existing.getQuantity());
//         } else {
//             // Lấy ảnh primary
//             List<Map<String, Object>> images =
//                     (List<Map<String, Object>>) product.get("images");
//             String image = null;
//             if (images != null && !images.isEmpty()) {
//                 image = (String) images.stream()
//                         .filter(img -> Boolean.TRUE.equals(img.get("isPrimary")))
//                         .findFirst()
//                         .orElse(images.get(0))
//                         .get("url");
//             }
//             items.add(CartItem.builder()
//                     .productId(req.getProductId())
//                     .variantId(req.getVariantId())
//                     .name((String) product.get("name"))
//                     .image(image)
//                     .quantity(req.getQuantity())
//                     .price(((Number) variant.get("price")).doubleValue())
//                     .lineTotal(((Number) variant.get("price")).doubleValue() * req.getQuantity())
//                     .size((String) variant.get("size"))
//                     .thickness((String) variant.get("thickness"))
//                     .color((String) variant.get("color"))
//                     .build());
//         }
//         return toCartResponse(cartRepository.save(cart));
//     }
//fake dữ liệu, chưa gọi tới http service
    @Override
    public CartResponse addItem(String userId, AddToCartRequest req) {

        Cart cart = getOrCreateCart(userId);
        List<CartItem> items = cart.getItems();

        CartItem existing = items.stream()
                .filter(i -> i.getProductId().equals(req.getProductId())
                && i.getVariantId().equals(req.getVariantId()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + req.getQuantity());
            existing.setLineTotal(existing.getPrice() * existing.getQuantity());
        } else {
            // TODO: thay bằng gọi product-service sau khi Eureka chạy
            double lineTotal = 999000 * req.getQuantity();
            items.add(CartItem.builder()
                    .productId(req.getProductId())
                    .variantId(req.getVariantId())
                    .name("Test Product")
                    .image("https://test.com/image.jpg")
                    .quantity(req.getQuantity())
                    .price(999000)
                    .lineTotal(lineTotal)
                    .size("160x200cm")
                    .thickness("10cm")
                    .color(null)
                    .build());
        }

        return toCartResponse(cartRepository.save(cart));
    }

    // ── UPDATE quantity ──────────────────────────────────────────────
    @Override
    public CartResponse updateQuantity(String userId, UpdateQuantityRequest req) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(req.getProductId())
                && i.getVariantId().equals(req.getVariantId()))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        item.setQuantity(req.getQuantity());
        item.setLineTotal(item.getPrice() * req.getQuantity());

        return toCartResponse(cartRepository.save(cart));
    }

    // ── REMOVE 1 item ────────────────────────────────────────────────
    @Override
    public CartResponse removeItem(String userId, String productId, String variantId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        boolean removed = cart.getItems().removeIf(i
                -> i.getProductId().equals(productId)
                && i.getVariantId().equals(variantId));

        if (!removed) {
            throw new AppException(ErrorCode.ITEM_NOT_FOUND);
        }

        return toCartResponse(cartRepository.save(cart));
    }

    // ── REMOVE các item đã thanh toán ────────────────────────────────
    @Override
    public CartResponse removeCheckedOutItems(String userId, CheckoutItemsRequest req) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        // Chỉ xóa những item user đã chọn thanh toán
        cart.getItems().removeIf(i -> req.getVariantIds().contains(i.getVariantId()));

        return toCartResponse(cartRepository.save(cart));
    }

    // ── CLEAR toàn bộ giỏ (nút "Xóa tất cả") ───────────────────────
    @Override
    public CartResponse clearCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));
        cart.setItems(new ArrayList<>());
        return toCartResponse(cartRepository.save(cart));
    }
}
