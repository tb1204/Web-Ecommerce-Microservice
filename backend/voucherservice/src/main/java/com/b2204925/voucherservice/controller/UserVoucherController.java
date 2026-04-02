package com.b2204925.voucherservice.controller;

import com.b2204925.voucherservice.dto.req.ApplyVoucherRequest;
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

    // POST /api/vouchers/apply — Áp dụng voucher (ghi nhận usage, gọi khi đặt hàng)
    @PostMapping("/apply")
    public ResponseEntity<ApplyVoucherResponse> apply(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ApplyVoucherRequest req) {
        String clerkId = jwt.getSubject();
        return ResponseEntity.ok(voucherService.applyVoucher(clerkId, req));
    }
}
