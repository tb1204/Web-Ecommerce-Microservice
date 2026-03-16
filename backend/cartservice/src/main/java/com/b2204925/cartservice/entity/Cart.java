//package com.b2204925.cartservice.entity;
//
//public class Cart {
//}
// ═══════════════════════════════════════════════════════
// ENTITY
// ═══════════════════════════════════════════════════════
// entity/Cart.java
package com.b2204925.cartservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId; // clerkId

    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    private CartSummary summary;
    private String note;
    private String status;
}
