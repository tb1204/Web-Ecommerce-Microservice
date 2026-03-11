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
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
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

    @PutMapping("update/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @RequestPart("product") Product product,
            @RequestPart(value="imageFiles", required = false) List<MultipartFile> imageFiles
    ){
        Product updated = productService.updateProduct(id, product, imageFiles);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {

        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
}
