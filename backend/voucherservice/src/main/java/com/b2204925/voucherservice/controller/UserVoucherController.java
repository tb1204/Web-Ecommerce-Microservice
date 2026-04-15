package com.b2204925.voucherservice.controller;

import com.b2204925.voucherservice.dto.req.ApplyVoucherRequest;
import com.b2204925.voucherservice.dto.req.ConfirmVoucherUsageRequest;
import com.b2204925.voucherservice.dto.res.ApplyVoucherResponse;
import com.b2204925.voucherservice.dto.res.VoucherResponse;
import com.b2204925.voucherservice.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserVoucherController {

    private final VoucherService voucherService;

    // GET /api/vouchers — Lấy danh sách voucher ACTIVE (user xem khi checkout)
    @GetMapping
    public ResponseEntity<List<VoucherResponse>> getActiveVouchers() {
        return ResponseEntity.ok(voucherService.getActiveVouchers());
    }

    // GET /api/vouchers/validate?code=SPRING10&amount=500000
    // Kiểm tra voucher hợp lệ mà KHÔNG ghi nhận usage (dùng khi user gõ code)
    @GetMapping("/validate")
    public ResponseEntity<VoucherResponse> validate(
            @RequestParam String code,
            @RequestParam(required = false) Double amount) {
        return ResponseEntity.ok(voucherService.validateVoucher(code, amount));
    }

    /**
     * POST /api/vouchers/apply
     * Validate + tính discount NHƯNG KHÔNG ghi nhận usage vào DB.
     * Dùng khi user chọn/nhập voucher trên checkout page.
     * Sau khi F5, voucher sẽ KHÔNG bị tính là đã dùng.
     */
    @PostMapping("/apply")
    public ResponseEntity<ApplyVoucherResponse> apply(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ApplyVoucherRequest req) {
        String clerkId = (jwt != null) ? jwt.getSubject() : "GUEST_" + java.util.UUID.randomUUID().toString();
        return ResponseEntity.ok(voucherService.previewVoucher(clerkId, req));
    }

    /**
     * POST /api/vouchers/confirm-usage
     * Ghi nhận usage thật sự vào DB — chỉ gọi sau khi order + payment tạo thành công.
     * Đây là bước DUY NHẤT ghi dữ liệu voucher-đã-dùng vào database.
     */
    @PostMapping("/confirm-usage")
    public ResponseEntity<Void> confirmUsage(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ConfirmVoucherUsageRequest req) {
        String clerkId = (jwt != null) ? jwt.getSubject() : null;
        for (String code : req.getCodes()) {
            try {
                voucherService.confirmVoucherUsage(clerkId, code, req.getOrderAmount());
            } catch (Exception e) {
                log.warn("Confirm usage failed for code={} user={}: {}", code, clerkId, e.getMessage());
                // Không throw để không block flow chính — log và bỏ qua
            }
        }
        return ResponseEntity.ok().build();
    }
}
