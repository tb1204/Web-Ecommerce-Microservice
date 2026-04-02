package com.b2204922.productservice.controller;

import com.b2204922.productservice.entity.Product;
import com.b2204922.productservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.b2204922.productservice.repository.ProductRepository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor

public class ProductController {

    private final ProductService productService; // Kết nối với Service

    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(
            @RequestPart("product") Product product,
            @RequestPart(value = "imageFiles", required = false) List<MultipartFile> imageFiles) {

        Product savedProduct = productService.addProduct(product, imageFiles);

        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
//        return ResponseEntity.ok("Xóa sản phẩm thành công!");
        return ResponseEntity.ok(Collections.singletonMap("message", "Xóa sản phẩm thành công!"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @RequestPart("product") Product product,
            @RequestPart(value = "imageFiles", required = false) List<MultipartFile> imageFiles
    ) {
        Product updated = productService.updateProduct(id, product, imageFiles);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/by-ids")
    public ResponseEntity<List<Product>> getProductsByIds(@RequestParam List<String> ids) {
        List<Product> products = productService.findProductsByIds(ids);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {

        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/updateStock")
    public ResponseEntity<?> updateStock(@RequestParam String productId, @RequestParam String variantId, @RequestParam int quantity) {
        productService.updateVariantStock(productId, variantId, quantity);
        return ResponseEntity.ok(Collections.singletonMap("message", "Cập nhật kho biến thể thành công"));
    }

    @PostMapping("/get-category-map")
    public ResponseEntity<Map<String, String>> getCategoryMap(@RequestBody List<String> productIds) {
        Map<String, String> resultMap = new HashMap<>();
        for (String id : productIds) {
            Product p = productService.findById(id);
            if (p != null) {
                resultMap.put(id, p.getCategory().getName());
            }
        }
        return ResponseEntity.ok(resultMap);
    }

    @GetMapping("/statistics/high-stock")
    public ResponseEntity<List<Map<String, Object>>> getHighStock() {
        return ResponseEntity.ok(productService.getHighStockProducts());
    }

    @GetMapping("/statistics/low-stock")
    public ResponseEntity<List<Map<String, Object>>> getLowStock() {
        return ResponseEntity.ok(productService.getLowStockProducts());
    }
}