package com.b2204922.orderservice.service;

import com.b2204922.orderservice.dto.request.OrderRequest;
import com.b2204922.orderservice.dto.response.OrderResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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

    boolean hasPurchased(String userId, String productId);

    public Double getTotalRevenue();

    List<OrderResponse> getOrdersByEmail(String email);

    public long getTotalOrdersCount();

    public long getOrdersCountByStatus(String status);

    public List<Map<String, Object>> getRevenueByCategory();

    public List<Map<String, Object>> getTopSellingProducts();

    public List<Map<String, Object>> getMostCancelledProducts();

    public List<Map<String, Object>> getRevenueByRange(LocalDate start, LocalDate end);

    List<Map<String, Object>> getTopSellingDashboard();
    public Integer countPurchasedProduct(String userId, String productId);
}
