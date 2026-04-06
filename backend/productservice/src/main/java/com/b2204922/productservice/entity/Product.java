package com.b2204922.productservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "products") //la 1 document trong db
@Data //tu dong tao cac ham getter/setter
@Builder //Tao doi tuong theo kieu lap rap
@NoArgsConstructor //Tao ham xay dung khong tham so
@AllArgsConstructor //Tao ham xay dung day du tham so
public class Product {

    @Id
    private String id;

    private String name;
//    private String sku;
    private String productCode;
    private Category category;
    private String brand;
    private String origin;
    private Double price;

    private Specifications specifications;

    private List<ProductVariant> variants;

    private Integer totalStockQuantity;
    private List<String> tags;
    private List<ProductImage> images;
    private String status;
    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductVariant {

        private String variantId;   // ID riêng cho từng biến thể
        private String sku;         // Mã kho riêng (VD: ART-160-10-TRANG)
        private String size;        // 1m6 x 2m
        private String thickness;   // 10cm
        private String color;       // Trắng
        private Double price;       // Giá riêng cho biến thể này
        private Double originalPrice; // Giá gốc chưa giảm (Để hiện gạch ngang)
        private Integer stockQuantity; // Kho riêng cho biến thể này
        private String status;      // ACTIVE hoặc OUT_OF_STOCK
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Category {

        private String name;
        private String code;
        private String parentCode;
        private String parentName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductImage {

        private String url;
        private Boolean isPrimary;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Specifications {

        private String material;
        private String weight;
        private String firmness;
//        private String size;
//        private String thickness;
        private String design;
        private String certificationNumber;
    }
}
