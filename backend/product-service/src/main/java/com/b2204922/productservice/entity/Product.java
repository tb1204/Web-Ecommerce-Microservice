package com.b2204922.productservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

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
    private String sku;
    private String productCode;
    private Category category;
    private String brand;
    private String origin;
    private Double price;
    private Double originalPrice;

    private Specifications specifications;
    private Integer stockQuantity;
    private List<String> tags;
    private List<ProductImage> images;
    private String status;
    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Category {

        private String name;
        private String code;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductImage {

        private String url;
        @JsonProperty("is_primary")
        private Boolean isPrimary;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Specifications {

        private String material;
        private String weight;
        private String dimensions;
        private String firmness;
        private String design;
        private String certificationNumber;
    }
}
