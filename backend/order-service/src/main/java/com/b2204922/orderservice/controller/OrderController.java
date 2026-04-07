package com.b2204922.orderservice.controller;

import com.b2204922.orderservice.dto.request.OrderRequest;
import com.b2204922.orderservice.dto.response.OrderResponse;
import com.b2204922.orderservice.exception.ResourceNotFoundException;
import com.b2204922.orderservice.service.IOrderService;
// import com.b2204922.orderservice.repository.OrderRepository;
// import com.b2204922.orderservice.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class OrderController {

    private final IOrderService orderService;
    // private final OrderRepository orderRepository;

    @PostMapping("/add")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable String id, @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.cancelOrder(id, request.getCancelReason()));
    }

    @GetMapping("/check-purchased")
    public ResponseEntity<Boolean> checkPurchased(@RequestParam String userId, @RequestParam String productId) {
        // Gọi qua orderService thay vì orderRepository
        boolean result = orderService.hasPurchased(userId, productId);
        return ResponseEntity.ok(result);
    }

    // Trong OrderController
    @PatchMapping("/payment-status/{orderNumber}")
    public ResponseEntity<OrderResponse> updatePaymentStatus(
            @PathVariable String orderNumber,
            @RequestParam String status,
            @RequestParam(required = false) String transactionId) {
        return ResponseEntity.ok(
                orderService.updatePaymentStatus(orderNumber, status, transactionId)
        );
    }

    //Tong doanh thu
    @GetMapping("/statistics/total-revenue")

    public ResponseEntity<Double> getTotalRevenue() {
        return ResponseEntity.ok(orderService.getTotalRevenue());
    }

    //Tinh so luong don hang
    @GetMapping("/statistics/order-counts")
    public ResponseEntity<Map<String, Long>> getOrderCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("total", orderService.getTotalOrdersCount());
        counts.put("pending", orderService.getOrdersCountByStatus("PENDING"));
        counts.put("cancelled", orderService.getOrdersCountByStatus("CANCELLED"));
        counts.put("delivered", orderService.getOrdersCountByStatus("DELIVERED"));
        counts.put("shipping", orderService.getOrdersCountByStatus("SHIPPING"));
        counts.put("processing", orderService.getOrdersCountByStatus("PROCESSING"));
        return ResponseEntity.ok(counts);
    }

    @GetMapping("/statistics/revenue-by-category")
    public ResponseEntity<List<Map<String, Object>>> getRevenueByCategory() {
        return ResponseEntity.ok(orderService.getRevenueByCategory());
    }

    @GetMapping("/statistics/top-selling")
    public ResponseEntity<List<Map<String, Object>>> getTopSelling() {
        return ResponseEntity.ok(orderService.getTopSellingProducts());
    }

    @GetMapping("/statistics/most-cancelled")
    public ResponseEntity<List<Map<String, Object>>> getMostCancelled() {
        return ResponseEntity.ok(orderService.getMostCancelledProducts());
    }

    //area chart
    @GetMapping("/statistics/revenue-growth")
    public ResponseEntity<List<Map<String, Object>>> getRevenueGrowth(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(orderService.getRevenueByRange(start, end));

    }

    @GetMapping("/statistics/top-selling-dashboard")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingDashboard() {
        return ResponseEntity.ok(orderService.getTopSellingDashboard());

    }
<<<<<<< HEAD
    // Thêm vào OrderController.java

    @GetMapping("/email/{email}")
    public ResponseEntity<List<OrderResponse>> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getOrdersByEmail(email));
    }
    // ✅ THÊM endpoint mới tìm theo orderId thay vì orderNumber

    // @PatchMapping("/payment-status-by-id/{orderId}")
    // public ResponseEntity<OrderResponse> updatePaymentStatusById(
    //         @PathVariable String orderId,
    //         @RequestParam String status,
    //         @RequestParam(required = false) String transactionId) {
    //     Order order = orderRepository.findById(orderId)
    //             .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + orderId));
    //     order.getPayment().setStatus(status);
    //     order.getPayment().setTransactionId(transactionId != null ? transactionId : "");
    //     order.setUpdatedAt(LocalDateTime.now());
    //     return ResponseEntity.ok(convertToOrderResponse(orderRepository.save(order)));
    // }
=======

    @GetMapping("/check-purchased-count")
    public ResponseEntity<Integer> getPurchasedCount(
            @RequestParam String userId,
            @RequestParam String productId) {

        Integer count = orderService.countPurchasedProduct(userId, productId);
        return ResponseEntity.ok(count);
    }
>>>>>>> ec1320aa9a7fc627aab9cb98cfa4112d9214c326
}
