package com.b2204922.orderservice.repository;

import com.b2204922.orderservice.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);

    Optional<Order> findByOrderNumber(String orderNumber);

    // Tìm xem có đơn hàng nào của User này, chứa Product này và đã ở trạng thái DELIVERED (Đã giao) chưa
    boolean existsByUserIdAndItems_ProductIdAndOrderStatus(String userId, String productId, String orderStatus);

}
