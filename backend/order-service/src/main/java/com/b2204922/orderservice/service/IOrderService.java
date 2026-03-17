package com.b2204922.orderservice.service;

import com.b2204922.orderservice.dto.request.OrderRequest;
import com.b2204922.orderservice.dto.response.OrderResponse;

import java.util.List;

public interface IOrderService {

    //tao don hang moi
    OrderResponse createOrder(OrderRequest request);

    //cac ham truy van don hang
    OrderResponse getOrderById(String id);
    OrderResponse getOrderByOrderNumber(String orderNumber);
    List<OrderResponse> getOrdersByUserId(String userId);
    List<OrderResponse> getAllOrders();

    //cap nhat trang thai
    OrderResponse updateOrderStatus(String id, String status);
    OrderResponse updatePaymentStatus(String orderNumber, String status, String transactionId);

    //huy don hang
    OrderResponse cancelOrder(String id, String reason);
}
