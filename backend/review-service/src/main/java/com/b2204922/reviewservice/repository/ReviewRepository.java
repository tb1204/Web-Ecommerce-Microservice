package com.b2204922.reviewservice.repository;

import com.b2204922.reviewservice.entity.Review;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ReviewRepository extends CrudRepository<Review, String> {
    @Override
    List<Review> findAll();

    // 1. Tìm theo trạng thái (approved, pending, rejected)
    List<Review> findByStatus(String status);

    // 2. Tìm theo danh sách ID sản phẩm (phục vụ lọc theo Danh mục)
    List<Review> findByProductIdIn(List<String> productIds);

    // 3. Tìm tất cả review của 1 sản phẩm
    List<Review> findByProductId(String productId);

    // Hàm này dùng để hiện review cho khách (productId + "approved")
    List<Review> findByProductIdAndStatus(String productId, String status);

    // Dùng khi admin vừa lọc "Nệm" vừa lọc "Đã ẩn"
    List<Review> findByStatusAndProductIdIn(String status, List<String> productIds);

    long countByUserIdAndProductId(String userId, String productId);

    long countByProductIdAndStatus(String productId, String approved);
}
