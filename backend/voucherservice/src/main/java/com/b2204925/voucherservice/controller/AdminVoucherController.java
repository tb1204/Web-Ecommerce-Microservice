package com.b2204925.voucherservice.controller;

import com.b2204925.voucherservice.dto.req.CreateVoucherRequest;
import com.b2204925.voucherservice.dto.req.UpdateVoucherRequest;
import com.b2204925.voucherservice.dto.res.VoucherResponse;
import com.b2204925.voucherservice.dto.res.VoucherStats;
import com.b2204925.voucherservice.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/vouchers")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminVoucherController {

    private final VoucherService voucherService;

    // GET /api/admin/vouchers — Lấy tất cả
    // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<VoucherResponse>> getAll() {
        return ResponseEntity.ok(voucherService.getAllVouchers());
    }

    // GET /api/admin/vouchers/{id} — Lấy chi tiết 1 voucher
    // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<VoucherResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(voucherService.getById(id));
    }

    // POST /api/admin/vouchers — Tạo mới
    // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<VoucherResponse> create(
            @Valid @RequestBody CreateVoucherRequest req) {
        VoucherResponse created = voucherService.createVoucher(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/admin/vouchers/{id} — Cập nhật
    // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<VoucherResponse> update(
            @PathVariable String id,
            @Valid @RequestBody UpdateVoucherRequest req) {
        return ResponseEntity.ok(voucherService.updateVoucher(id, req));
    }

    // DELETE /api/admin/vouchers/{id} — Xóa
    // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.noContent().build();
    }

    // PATCH /api/admin/vouchers/{id}/toggle-status — Vô hiệu / Khôi phục
    // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<VoucherResponse> toggleStatus(@PathVariable String id) {
        return ResponseEntity.ok(voucherService.toggleStatus(id));
    }

    // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<VoucherStats> getStats() {
        return ResponseEntity.ok(voucherService.getVoucherStats());
    }
}
