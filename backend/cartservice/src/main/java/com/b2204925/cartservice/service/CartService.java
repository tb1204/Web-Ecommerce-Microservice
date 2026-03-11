//package com.b2204925.cartservice.service;
//
//public class CartService {
//}
// ═══════════════════════════════════════════════════════
// SERVICE
// ═══════════════════════════════════════════════════════
// service/CartService.java
package com.b2204925.cartservice.service;

import com.b2204925.cartservice.dto.req.*;
import com.b2204925.cartservice.dto.res.CartResponse;
import java.util.List;

public interface CartService {

    CartResponse getCart(String userId);

    CartResponse addItem(String userId, AddToCartRequest req);

    CartResponse updateQuantity(String userId, UpdateQuantityRequest req);

    CartResponse removeItem(String userId, String productId, String variantId);

    CartResponse removeCheckedOutItems(String userId, CheckoutItemsRequest req);

    CartResponse clearCart(String userId);
}
