package com.b2204922.reviewservice.service;

import com.b2204922.reviewservice.config.RabbitMQConfig;
import com.b2204922.reviewservice.entity.AdminReply;
import com.b2204922.reviewservice.entity.Review;
import com.b2204922.reviewservice.dto.ReviewRequest;
import com.b2204922.reviewservice.dto.ReviewResponse;
import com.b2204922.reviewservice.dto.AdminReplyRequest;
import com.b2204922.reviewservice.repository.ReviewRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestTemplate restTemplate;
    private final RabbitTemplate rabbitTemplate;
    private final Cloudinary cloudinary;

    // Lấy review để hiển thị trên trang sản phẩm (Chỉ lấy cái 'approved')
    public List<ReviewResponse> getApprovedReviewsByProduct(String productId) {
        return reviewRepository.findByProductIdAndStatus(productId, "approved").stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Tính điểm trung bình để hiện "sao" sản phẩm
    public double getAverageRating(String productId) {
        List<Review> reviews = reviewRepository.findByProductIdAndStatus(productId, "approved");
        if (reviews.isEmpty()) return 0.0;
        return reviews.stream().mapToDouble(Review::getRating).average().orElse(0.0);
    }

    // Tạo đánh giá mới
//    public ReviewResponse createReview(ReviewRequest request) {
//        // 1. GỌI SANG ORDER SERVICE ĐỂ KIỂM TRA
//        String orderServiceUrl = "http://localhost:8084/api/orders/check-purchased?userId="
//                + request.getUserId() + "&productId=" + request.getProductId();
//
//        Boolean hasPurchased = restTemplate.getForObject(orderServiceUrl, Boolean.class);
//
//        // 2. NẾU CHƯA MUA THÌ CHẶN LẠI
//        if (hasPurchased == null || !hasPurchased) {
//            throw new RuntimeException("Bạn chỉ có thể đánh giá sản phẩm đã mua!");
//        }
//
//        // 3. NẾU ĐÃ MUA, TẠO REVIEW VỚI TRẠNG THÁI APPROVED
//        Review review = Review.builder()
//                .productId(request.getProductId())
//                .userId(request.getUserId())
//                .username(request.getUserName())
//                .comment(request.getComment())
//                .rating(request.getRating())
//                .images(request.getImages())
//                .status("approved")
//                .createAt(LocalDateTime.now())
//                .updateAt(LocalDateTime.now())
//                .build();
//
//        return convertToResponse(reviewRepository.save(review));
//    }
    // Tạo đánh giá mới (Đã thêm logic chống spam: 1 lần mua = 1 lần đánh giá)
    public ReviewResponse createReview(ReviewRequest request) {
        // 1. GỌI SANG ORDER SERVICE ĐỂ LẤY SỐ LƯỢNG ĐÃ MUA
        String orderServiceUrl = "http://localhost:8084/api/orders/count-purchased?userId="
                + request.getUserId() + "&productId=" + request.getProductId();

        Integer purchaseCount = restTemplate.getForObject(orderServiceUrl, Integer.class);

        if (purchaseCount == null || purchaseCount <= 0) {
            throw new RuntimeException("Bạn phải mua sản phẩm này mới được đánh giá!");
        }

        // 2. ĐẾM SỐ LẦN USER NÀY ĐÃ ĐÁNH GIÁ SẢN PHẨM NÀY TRONG DATABASE
        long reviewCount = reviewRepository.countByUserIdAndProductId(request.getUserId(), request.getProductId());

        // 3. SO SÁNH: Nếu đã đánh giá hết số lần mua thì chặn
        if (reviewCount >= purchaseCount) {
            throw new RuntimeException("Bạn đã đánh giá hết lượt cho lần mua này rồi. Mua thêm để đánh giá tiếp!");
        }

        // 4. NẾU CÒN LƯỢT THÌ TẠO REVIEW
        Review review = Review.builder()
                .productId(request.getProductId())
                .userId(request.getUserId())
                .username(request.getUserName())
                .comment(request.getComment())
                .rating(request.getRating())
                .images(request.getImages())
                .status("approved")
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();

        return convertToResponse(reviewRepository.save(review));
    }

    // Lấy tất cả review
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Duyệt/Ẩn review
    public ReviewResponse toggleStatus(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy review"));

        String newStatus = "approved".equalsIgnoreCase(review.getStatus()) ? "rejected" : "approved";
        review.setStatus(newStatus);
        review.setUpdateAt(LocalDateTime.now());
        return convertToResponse(reviewRepository.save(review));
    }

    // Thêm/Sửa phản hồi Admin
    public ReviewResponse addAdminReply(String reviewId, AdminReplyRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy review"));

        AdminReply reply = AdminReply.builder()
                .content(request.getContent())
                .repliedAt(LocalDateTime.now())
                .build();

        review.setAdminReply(reply);
        review.setUpdateAt(LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);
        try {
            com.b2204922.reviewservice.dto.NotificationDTO dto = com.b2204922.reviewservice.dto.NotificationDTO.builder()
                    .userId(savedReview.getUserId())
                    .title("Phản hồi từ Artisano")
                    .message("Admin đã trả lời đánh giá của bạn. Xem ngay nhé!")
                    .type("COMMENT")
                    .productId(savedReview.getProductId())
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE,
                    RabbitMQConfig.ROUTING_KEY, dto);
            System.out.println("Đã bắn tin RabbitMQ cho Review của User: " + savedReview.getUserId());
        } catch (Exception e) {
            System.err.println("Lỗi gửi thông báo Review: " + e.getMessage());
        }
        return convertToResponse(savedReview);
    }

    // Xóa phản hồi Admin
    public ReviewResponse removeAdminReply(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy review"));
        review.setAdminReply(null);
        review.setUpdateAt(LocalDateTime.now());
        return convertToResponse(reviewRepository.save(review));
    }

    // Hàm dọn dẹp ảnh trên Cloudinary (Helper)
    private void deleteImagesFromCloudinary(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) return;

        for (String url : imageUrls) {
            try {
                // Tách Public ID: .../reviews/abcxyz.jpg -> reviews/abcxyz
                String publicIdWithExtension = url.substring(url.lastIndexOf("/") + 1);
                String publicId = "reviews/" + publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."));

                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                System.out.println("Đã xóa ảnh trên Cloudinary: " + publicId);
            } catch (Exception e) {
                System.err.println("Lỗi khi xóa ảnh Cloudinary: " + e.getMessage());
            }
        }
    }

    // hàm xóa Review vĩnh viễn
    public void deleteReview(String reviewId) {
        // Tìm review trong DB trước khi xóa để lấy danh sách URL ảnh
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy review để xóa"));

        //  Xóa các tấm ảnh liên quan trên Cloudinary
        deleteImagesFromCloudinary(review.getImages());

        //  Xóa record trong Database
        reviewRepository.deleteById(reviewId);
    }

    private ReviewResponse convertToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .userId(review.getUserId())
                .username(review.getUsername())
                .comment(review.getComment())
                .rating(review.getRating())
                .images(review.getImages())
                .status(review.getStatus())
                .isHidden(!"approved".equalsIgnoreCase(review.getStatus()))
                .adminReplyContent(review.getAdminReply() != null ? review.getAdminReply().getContent() : null)
                .adminReplyDate(review.getAdminReply() != null ? review.getAdminReply().getRepliedAt() : null)
                .createAt(review.getCreateAt())
                .updateAt(review.getUpdateAt())
                .build();
    }

    // Logic: Check trước, Up ảnh sau
    public ReviewResponse createReviewWithImages(ReviewRequest request, List<MultipartFile> imageFiles) {
        // 1. Log xem User ID và Product ID gửi lên là gì
        System.out.println("--- CHECK REVIEW PERMISSION ---");
        System.out.println("User ID: " + request.getUserId());
        System.out.println("Product ID: " + request.getProductId());

        String orderServiceUrl = "http://localhost:8084/api/orders/check-purchased-count?userId="
                + request.getUserId() + "&productId=" + request.getProductId();

        Integer purchaseCount = restTemplate.getForObject(orderServiceUrl, Integer.class);
        System.out.println("Số lần đã mua từ OrderService: " + purchaseCount);

        long existingReviews = reviewRepository.countByUserIdAndProductId(request.getUserId(), request.getProductId());
        System.out.println("Số review đã có trong DB: " + existingReviews);

        if (purchaseCount == null || purchaseCount <= 0) {
            throw new RuntimeException("Bạn phải mua sản phẩm này mới được đánh giá!");
        }

        if (existingReviews >= purchaseCount) {
            throw new RuntimeException("Bạn đã dùng hết lượt đánh giá cho các lần mua sản phẩm này rồi!");
        }

        // NẾU OK THÌ MỚI UP ẢNH
        List<String> imageUrls = new ArrayList<>();
        if (imageFiles != null && !imageFiles.isEmpty()) {
            for (MultipartFile file : imageFiles) {
                try {
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                            ObjectUtils.asMap("folder", "reviews"));
                    imageUrls.add(uploadResult.get("url").toString());
                } catch (IOException e) {
                    System.err.println("Lỗi up ảnh: " + e.getMessage());
                }
            }
        }

        Review review = Review.builder()
                .productId(request.getProductId())
                .userId(request.getUserId())
                .username(request.getUserName())
                .comment(request.getComment())
                .rating(request.getRating())
                .images(imageUrls)
                .status("approved")
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();

        return convertToResponse(reviewRepository.save(review));
    }

    public long countApprovedReviews(String productId) {
        // Gọi repo để đếm những review của sản phẩm này đã được duyệt (approved)
        return reviewRepository.countByProductIdAndStatus(productId, "approved");
    }
}
