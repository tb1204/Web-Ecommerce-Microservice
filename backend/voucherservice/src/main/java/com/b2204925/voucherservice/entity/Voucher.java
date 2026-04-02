// package com.b2204925.voucherservice.entity;
package com.b2204925.voucherservice.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vouchers")
public class Voucher {

    @Id
    private String id;
    // → Frontend nhận là "_id" nhờ VoucherResponse map lại

    @Indexed(unique = true)
    private String code;
    // Mã duy nhất — VD: "ARTISANOSHIP", "SPRING10"

    private String name;
    // Tên chương trình — VD: "Miễn phí vận chuyển nội thành"

    private VoucherType voucherType;
    // PRODUCT_DISCOUNT | SHIPPING_DISCOUNT

    private DiscountType discountType;
    // FIXED_AMOUNT | PERCENTAGE

    private Double discountValue;
    // Giá trị giảm: số tiền (VND) hoặc phần trăm (1-100)

    private Double maxDiscountAmount;
    // Giảm tối đa (áp dụng khi discountType = PERCENTAGE)

    private Double minOrderAmount;
    // Đơn hàng tối thiểu để áp dụng voucher

    private UsageLimit usageLimit;
    // Giới hạn sử dụng

    private Validity validity;
    // Thời hạn hiệu lực

    @Builder.Default
    private VoucherStatus status = VoucherStatus.ACTIVE;

    @Builder.Default
    private Boolean isStackable = false;
    // Có thể kết hợp nhiều voucher không

    @Builder.Default
    private List<String> userUsedList = new ArrayList<>();
    // Danh sách clerkId user đã dùng

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
