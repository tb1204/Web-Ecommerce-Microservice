package com.b2204922.orderservice.dto.request;

public class TopSellingProductDto {
    private String productId;
    private int salesCount;

    // Constructor
    public TopSellingProductDto(String productId, int salesCount) {
        this.productId = productId;
        this.salesCount = salesCount;
    }

    // Getters (không cần setter vì chỉ đọc)
    public String getProductId() {
        return productId;
    }

    public int getSalesCount() {
        return salesCount;
    }
}
