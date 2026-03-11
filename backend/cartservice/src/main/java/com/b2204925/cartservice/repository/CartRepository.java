//package com.b2204925.cartservice.repository;
//
//public class CartRepository {
//}

// ═══════════════════════════════════════════════════════
// REPOSITORY
// ═══════════════════════════════════════════════════════

// repository/CartRepository.java
package com.b2204925.cartservice.repository;

import com.b2204925.cartservice.entity.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUserId(String userId);
}