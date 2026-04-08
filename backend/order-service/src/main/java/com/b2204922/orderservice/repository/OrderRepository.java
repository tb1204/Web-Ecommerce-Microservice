package com.b2204922.orderservice.repository;

import com.b2204922.orderservice.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByUserId(String userId);

    List<Order> findByCreatedAtBetweenAndOrderStatus(LocalDateTime startDateTime, LocalDateTime endDateTime, String orderStatus);

    Optional<Order> findByOrderNumber(String orderNumber);

    // Tìm xem có đơn hàng nào của User này, chứa Product này và đã ở trạng thái DELIVERED (Đã giao) chưa
    boolean existsByUserIdAndItems_ProductIdAndOrderStatus(String userId, String productId, String orderStatus);

    List<Order> findByCustomerInfoEmail(String email);

    //lay don hang co trang thai thanh cong de tinh tien
    List<Order> findByOrderStatus(String orderStatus);

    // Đếm tổng tất cả đơn hàng trong hệ thống
    long count();

    // Đếm số đơn hàng theo trạng thái (Dùng cho "Đang xử lý" hoặc "Đã hủy")
    long countByOrderStatus(String orderStatus);

    //Kiem tra don hang VNPAY nhung PENDING
    @Query("{ 'payment.method': ?0, 'payment.status': ?1, 'createdAt': { $lt: ?2 } }")
    List<Order> findExpiredVnpayOrders(String method, String status, Instant threshold);
}
