package com.b2204925.chatservice.entity;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageMetadata {

    private String intent;
    // VD: "order.inquiry"

    private Double confidence;
    // 0.0 - 1.0

    @Builder.Default
    private Boolean isBotResponse = false;

    @Builder.Default
    private Boolean botFallback = false;

    private List<String> quickReplies;
    // Dialogflow quick reply buttons  VD: ["Xem đơn hàng", "Hủy đơn", "Liên hệ admin"] Frontend hiển thị các nút này cho user bấm

    private List<ProductLink> productLinks;
    // Danh sách sản phẩm kèm link để frontend render nút "Xem ngay"

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductLink {
        private String name;
        private String slug;   // slug để tạo URL: /products/{slug}
        private Long price;
    }
}
