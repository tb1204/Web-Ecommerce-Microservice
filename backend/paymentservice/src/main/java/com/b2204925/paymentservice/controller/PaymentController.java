
package com.b2204925.paymentservice.controller;

import com.b2204925.paymentservice.dto.req.CreatePaymentRequest;
import com.b2204925.paymentservice.dto.req.RefundRequest;
import com.b2204925.paymentservice.dto.res.PaymentResponse;
import com.b2204925.paymentservice.entity.PaymentStatus;
import com.b2204925.paymentservice.service.PaymentService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ✅ Cho phép guest checkout — userId lấy từ JWT nếu có, không thì dùng "guest"
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreatePaymentRequest req) {
        // Nếu chưa đăng nhập → userId = "guest"
        String userId = (jwt != null) ? jwt.getSubject() : "guest";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentService.createPayment(userId, req));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getByOrderId(@PathVariable String orderId) {
        return ResponseEntity.ok(paymentService.getByOrderId(orderId));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getById(@PathVariable String paymentId) {
        return ResponseEntity.ok(paymentService.getById(paymentId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PaymentResponse>> getMyPayments(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(paymentService.getByUserId(jwt.getSubject()));
    }

    // VNPay callback — redirect về frontend
    @GetMapping("/vnpay/return")
    public void handleVNPayReturn(
            @RequestParam Map<String, String> vnpayParams,
            HttpServletResponse httpResponse) throws IOException {

        try {
            PaymentResponse payment = paymentService.handleVNPayReturn(vnpayParams);

            if (payment.getPaymentStatus().equals(PaymentStatus.PAID)) {
                httpResponse.sendRedirect(
                        "http://localhost:5173/payment-success?orderId=" + payment.getOrderId()
                );
            } else {
                httpResponse.sendRedirect(
                        "http://localhost:5173/payment-failed?orderId=" + payment.getOrderId()
                );
            }
        } catch (Exception e) {
            log.error("Lỗi xử lý VNPay return: ", e);
            httpResponse.sendRedirect("http://localhost:5173/payment-failed");
        }
    }

    @PatchMapping("/order/{orderId}/confirm-cod")
    public ResponseEntity<PaymentResponse> confirmCOD(@PathVariable String orderId) {
        return ResponseEntity.ok(paymentService.confirmCOD(orderId));
    }

    @PatchMapping("/order/{orderId}/cancel")
    public ResponseEntity<PaymentResponse> cancel(@PathVariable String orderId) {
        return ResponseEntity.ok(paymentService.cancelPayment(orderId));
    }

    @PatchMapping("/order/{orderId}/refund")
    public ResponseEntity<PaymentResponse> refund(
            @PathVariable String orderId,
            @RequestBody RefundRequest req) {
        return ResponseEntity.ok(paymentService.refund(orderId, req));
    }
}
