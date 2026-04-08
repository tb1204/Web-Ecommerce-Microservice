package com.b2204922.orderservice.service;

import com.b2204922.orderservice.entity.Order;
import com.b2204922.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class OrderCleanupTask {
    private final OrderRepository orderRepository;

    // Chạy mỗi 60.000ms (1 phút)
    @Scheduled(fixedRate = 60000)
    public void cleanupFailedOrders() {
        Instant threshold = Instant.now().minus(Duration.ofMinutes(15));

        // Tìm các đơn hàng VNPAY, trạng thái PENDING và tạo trước thời điểm threshold
        List<Order> expiredOrders = orderRepository.findExpiredVnpayOrders(
                "VNPAY", "UNPAID", threshold
        );

        if (!expiredOrders.isEmpty()) {
            log.info("🧹 Đang dọn dẹp {} đơn hàng VNPAY quá hạn thanh toán...", expiredOrders.size());

            // Ông có thể chọn Xóa luôn (Hard Delete) hoặc đổi sang CANCELLED
            // Ở đây tui ví dụ Xóa luôn cho sạch DB như ông muốn:
            orderRepository.deleteAll(expiredOrders);

            log.info("✅ Đã dọn dẹp xong đơn hàng rác.");
        }
    }
}
