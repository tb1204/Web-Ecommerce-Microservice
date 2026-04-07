package com.b2204922.reviewservice.controller;

import com.b2204922.reviewservice.dto.*;
import com.b2204922.reviewservice.service.ReviewService;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private Cloudinary cloudinary;

    //  ENDPOINTS CHO user
//    @PostMapping("/add")
//    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest request) {
//        return ResponseEntity.ok(reviewService.createReview(request));
//    }
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewResponse> createReview(
            @RequestPart("review") ReviewRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        return ResponseEntity.ok(reviewService.createReviewWithImages(request, images));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getApprovedReviews(@PathVariable String productId) {
        return ResponseEntity.ok(reviewService.getApprovedReviewsByProduct(productId));
    }

    @GetMapping("/rating/{productId}")
    public ResponseEntity<Double> getAverageRating(@PathVariable String productId) {
        return ResponseEntity.ok(reviewService.getAverageRating(productId));
    }

    //  ENDPOINTS CHO ADMIN
    @GetMapping("/all")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @PutMapping("/toggle/{id}")
    public ResponseEntity<ReviewResponse> toggleStatus(@PathVariable String id) {
        return ResponseEntity.ok(reviewService.toggleStatus(id));
    }

    @PutMapping("/reply/{id}")
    public ResponseEntity<ReviewResponse> addReply(@PathVariable String id, @RequestBody AdminReplyRequest request) {
        return ResponseEntity.ok(reviewService.addAdminReply(id, request));
    }

    @DeleteMapping("/reply/{id}")
    public ResponseEntity<ReviewResponse> deleteReply(@PathVariable String id) {
        return ResponseEntity.ok(reviewService.removeAdminReply(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    //  XỬ LÝ UPLOAD ẢNH
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image) {
        try {
            // Upload lên folder 'reviews' trên Cloudinary cho dễ quản lý
            Map uploadResult = cloudinary.uploader().upload(image.getBytes(),
                    ObjectUtils.asMap("folder", "reviews"));

            String imageUrl = uploadResult.get("url").toString();

            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl); // Trả về link https://cloudinary...

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi upload Cloudinary: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-image")
    public ResponseEntity<?> deleteImage(@RequestParam("url") String imageUrl) {
        try {

            String publicIdWithExtension = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            String publicId = "reviews/" + publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."));

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi xóa ảnh: " + e.getMessage());
        }
    }

    @PostMapping("/ratings/batch")
    public ResponseEntity<Map<String, Map<String, Object>>> getBatchRatings(@RequestBody List<String> productIds) {
        Map<String, Map<String, Object>> result = new HashMap<>();

        for (String pid : productIds) {
            double avg = reviewService.getAverageRating(pid);
            long count = reviewService.countApprovedReviews(pid);

            Map<String, Object> data = new HashMap<>();
            data.put("rating", avg);
            data.put("reviewCount", count);

            result.put(pid, data);
        }
        return ResponseEntity.ok(result);
    }
}
