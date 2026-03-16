package com.b2204922.orderservice.repository;

import com.b2204922.orderservice.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);

    Optional<Order> findByOrderNumber(String orderNumber);


}
