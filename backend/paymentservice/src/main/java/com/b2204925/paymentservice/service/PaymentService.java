// package com.b2204925.paymentservice.service;
// public class PaymentService {
// }
package com.b2204925.paymentservice.service;

import com.b2204925.paymentservice.dto.req.CreatePaymentRequest;
import com.b2204925.paymentservice.dto.req.RefundRequest;
import com.b2204925.paymentservice.dto.res.PaymentResponse;
import com.b2204925.paymentservice.entity.Payment;
import com.b2204925.paymentservice.entity.PaymentMethod;
import com.b2204925.paymentservice.entity.PaymentStatus;
import com.b2204925.paymentservice.exception.AppException;
import com.b2204925.paymentservice.exception.ErrorCode;
import com.b2204925.paymentservice.repository.PaymentRepository;
import com.b2204925.paymentservice.util.VNPayUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final VNPayUtil vnPayUtil;

    public PaymentResponse createPayment(String userId, CreatePaymentRequest req) {
        paymentRepository.findByOrderId(req.getOrderId()).ifPresent(p -> {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_EXISTS);
        });

        Payment payment = Payment.builder()
                .orderId(req.getOrderId())
                .userId(userId)
                .paymentMethod(req.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .amount(req.getAmount())
                .voucherCode(req.getVoucherCode())
                .voucherDiscount(req.getVoucherDiscount() != null ? req.getVoucherDiscount() : 0L)
                .build();

        if (req.getPaymentMethod() == PaymentMethod.VNPAY) {
            String paymentUrl = vnPayUtil.buildPaymentUrl(
                    req.getOrderId(), req.getAmount(), req.getClientIp()
            );
            payment.setPaymentUrl(paymentUrl);
            payment.setExpiresAt(Instant.now().plusSeconds(900));
        }

        Payment saved = paymentRepository.save(payment);
        log.info("Created payment {} for order {} method {}", saved.getId(), saved.getOrderId(), saved.getPaymentMethod());
        return toResponse(saved);
    }

    public PaymentResponse getByOrderId(String orderId) {
        return toResponse(paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND)));
    }

    public PaymentResponse getById(String paymentId) {
        return toResponse(paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND)));
    }

    public List<PaymentResponse> getByUserId(String userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PaymentResponse handleVNPayReturn(Map<String, String> params) {
        String orderId = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");
        String transactionId = params.get("vnp_TransactionNo");

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        payment.setResponseCode(responseCode);
        payment.setTransactionId(transactionId);
        payment.setPaymentGatewayResponse(params.toString());
        payment.setUpdatedAt(Instant.now());

        boolean isValidSignature = vnPayUtil.verifyReturn(params);
        boolean isResponseSuccess = "00".equals(responseCode);
        boolean isTransactionSuccess = "00".equals(transactionStatus);

        if (isValidSignature && isResponseSuccess && isTransactionSuccess) {
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setPaidAt(Instant.now());
            log.info("VNPay SUCCESS for order {}", orderId);
        } else {
            payment.setPaymentStatus(PaymentStatus.FAILED);

            // ← THÊM: lưu message tiếng Việt thay vì mã số
            String failMessage = vnPayUtil.getResponseMessage(responseCode);
            payment.setFailedReason(failMessage);

            log.warn("VNPay FAILED for order {} | reason: {}", orderId, failMessage);
        }

        return toResponse(paymentRepository.save(payment));
    }

    public PaymentResponse confirmCOD(String orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getPaymentMethod() != PaymentMethod.COD) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_STATUS, "Chỉ áp dụng cho COD");
        }
        if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_STATUS, "Thanh toán không ở trạng thái PENDING");
        }

        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setPaidAt(Instant.now());
        payment.setUpdatedAt(Instant.now());
        return toResponse(paymentRepository.save(payment));
    }

    public PaymentResponse cancelPayment(String orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_STATUS, "Không thể huỷ thanh toán đã hoàn tất");
        }

        payment.setPaymentStatus(PaymentStatus.CANCELLED);
        payment.setUpdatedAt(Instant.now());
        return toResponse(paymentRepository.save(payment));
    }

    public PaymentResponse refund(String orderId, RefundRequest req) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getPaymentStatus() != PaymentStatus.PAID) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_STATUS, "Chỉ hoàn tiền được khi đã thanh toán");
        }

        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        payment.setRefundAmount(req.getRefundAmount());
        payment.setRefundReason(req.getRefundReason());
        payment.setRefundedAt(Instant.now());
        payment.setUpdatedAt(Instant.now());
        return toResponse(paymentRepository.save(payment));
    }

    private PaymentResponse toResponse(Paymenta p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .orderId(p.getOrderId())
                .userId(p.getUserId())
                .paymentMethod(p.getPaymentMethod())
                .paymentStatus(p.getPaymentStatus())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .paymentUrl(p.getPaymentUrl())
                .transactionId(p.getTransactionId())
                .voucherCode(p.getVoucherCode())
                .voucherDiscount(p.getVoucherDiscount())
                .refundAmount(p.getRefundAmount())
                .refundReason(p.getRefundReason())
                .failedReason(p.getFailedReason())
                .paidAt(p.getPaidAt())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
