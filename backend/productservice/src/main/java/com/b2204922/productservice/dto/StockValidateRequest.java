package com.b2204922.productservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class StockValidateRequest {
    private List<ItemRequest> items;

    @Data
    public static class ItemRequest {
        private String productId;
        private String variantId;
        private Integer quantity;
    }
}
