package com.b2204925.userservice.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.b2204925.userservice.entity.Address;
import com.b2204925.userservice.entity.Membership;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String clerkId;

    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String phone;
    private Instant dateOfBirth;
    private String gender;
    private String avatarUrl;

    // tổng tiền đã mua
    @Builder.Default
    private BigDecimal totalSpent = BigDecimal.ZERO;

    // membership hiện tại
    @Builder.Default
    private Membership membership = Membership.MEMBER;

    @Builder.Default
    private int purchaseCount = 0;

    @Builder.Default
    private String provider = "clerk";

    @Builder.Default
    private List<String> roles = new ArrayList<>(List.of("USER"));

    @Builder.Default
    private List<Address> addresses = new ArrayList<>();

// Thêm vào sau field addresses:
@Builder.Default
private List<String> wishlist = new ArrayList<>();
// Lưu danh sách productId user đã thích
// VD: ["product_001", "product_002"]
    
    @JsonProperty("isActive")
    @Builder.Default
    private Boolean isActive = true;

    // true = bị khóa tạm thời qua Clerk lock
    @JsonProperty("isBlocked")
    @Builder.Default
    private Boolean isBlocked = false;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();

    public void updateMembership() {
        this.membership = Membership.getTier(
                this.purchaseCount,
                this.totalSpent.doubleValue()
        );
    }

    public void addOrder(double amount) {
        this.purchaseCount++;
        this.totalSpent = this.totalSpent.add(BigDecimal.valueOf(amount));
        updateMembership();
    }

    public double getDiscountRate() {
        return membership.getDiscountRate();
    }

    public boolean isAdmin() {
        return roles.contains("ADMIN");
    }

    public void touch() {
        this.updatedAt = Instant.now();
    }
}
