package com.b2204922.productservice.controller;

import com.b2204922.productservice.dto.StockValidateRequest;
import com.b2204922.productservice.entity.Product;
import com.b2204922.productservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.b2204922.productservice.repository.ProductRepository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
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
            @RequestPart(value = "primaryImage", required = false) MultipartFile primaryImage, // Ghế riêng cho ảnh đại diện
            @RequestPart(value = "imageFiles", required = false) List<MultipartFile> imageFiles // Chỉ dành cho ảnh phụ
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

    // Lấy sản phẩm theo danh mục con (Ga lẻ, Mền...)
    @GetMapping("/category/{code}")
    public ResponseEntity<List<Product>> getBySubCategory(@PathVariable String code) {
        return ResponseEntity.ok(productService.getProductsBySubCategory(code));
    }

    // Lấy sản phẩm theo danh mục cha (Nệm, Chăn ga...)
    @GetMapping("/parent-category/{parentCode}")
    public ResponseEntity<List<Product>> getByParentCategory(@PathVariable String parentCode) {
        return ResponseEntity.ok(productService.getProductsByParentCategory(parentCode));
    }

    @GetMapping("/discount")
    public ResponseEntity<List<Product>> getDiscountProducts() {
        List<Product> discountProducts = productService.getDiscountProducts();
        return ResponseEntity.ok(discountProducts);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("q") String query) {
        return ResponseEntity.ok(productService.searchByName(query));
    }

    @PostMapping("/validate-stock")
    public ResponseEntity<?> validateStock(@RequestBody StockValidateRequest request) {
        log.info("🛒 Nhận yêu cầu kiểm tra kho cho {} items", request.getItems().size());

        // Chuyển đổi DTO sang List<Map> để khớp với hàm trong Service tui viết lúc nãy
        // Hoặc ông có thể sửa hàm Service để nhận trực tiếp DTO cho chuyên nghiệp
        List<Map<String, Object>> itemsToCheck = request.getItems().stream().map(item -> {
            Map<String, Object> map = new HashMap<>();
            map.put("productId", item.getProductId());
            map.put("variantId", item.getVariantId());
            map.put("quantity", item.getQuantity());
            return map;
        }).collect(Collectors.toList());

        List<Map<String, Object>> errors = productService.validateStock(itemsToCheck);

        if (errors.isEmpty()) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Tất cả sản phẩm đều đủ hàng"));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
