package com.b2204925.voucherservice.service;

import com.b2204925.voucherservice.dto.req.ApplyVoucherRequest;
import com.b2204925.voucherservice.dto.req.CreateVoucherRequest;
import com.b2204925.voucherservice.dto.req.UpdateVoucherRequest;
import com.b2204925.voucherservice.dto.res.ApplyVoucherResponse;
import com.b2204925.voucherservice.dto.res.VoucherResponse;
import com.b2204925.voucherservice.dto.res.VoucherStats;
import com.b2204925.voucherservice.entity.*;
import com.b2204925.voucherservice.exception.AppException;
import com.b2204925.voucherservice.exception.ErrorCode;
import com.b2204925.voucherservice.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;

    // ── ADMIN: Lấy tất cả voucher ────────────────────────────────
    public List<VoucherResponse> getAllVouchers() {
        return voucherRepository.findAllByOrderByCreatedAtDesc() //sắp xếp giảm dần,mới nhất lên đầu 
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── ADMIN: Lấy 1 voucher theo ID ─────────────────────────────
    public VoucherResponse getById(String id) {
        return toResponse(findByIdOrThrow(id));
    }

    // ── USER: Lấy danh sách voucher ACTIVE ───────────────────────
    public List<VoucherResponse> getActiveVouchers() {
        // Tự động cập nhật status EXPIRED trước khi trả về
        autoExpireVouchers();
        return voucherRepository.findByStatus(VoucherStatus.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── ADMIN: Tạo voucher mới ───────────────────────────────────
    public VoucherResponse createVoucher(CreateVoucherRequest req) {
        // Kiểm tra code trùng
        if (voucherRepository.existsByCode(req.getCode().toUpperCase())) {
            throw new AppException(ErrorCode.VOUCHER_CODE_DUPLICATE,
                    "Mã '" + req.getCode() + "' đã tồn tại");
        }

        // Validate discountValue nếu là PERCENTAGE
        if (req.getDiscountType() == DiscountType.PERCENTAGE
                && req.getDiscountValue() > 100) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Phần trăm giảm không được vượt quá 100");
        }

        Voucher voucher = Voucher.builder()
                .code(req.getCode().toUpperCase().trim())
                .name(req.getName())
                .voucherType(req.getVoucherType())
                .discountType(req.getDiscountType())
                .discountValue(req.getDiscountValue())
                .maxDiscountAmount(req.getMaxDiscountAmount())
                .minOrderAmount(req.getMinOrderAmount())
                .usageLimit(UsageLimit.builder()
                        .total(req.getUsageLimit().getTotal())
                        .perUser(req.getUsageLimit().getPerUser())
                        .used(0)
                        .build())
                .validity(Validity.builder()
                        .start(Instant.parse(req.getValidity().getStart()))
                        .end(Instant.parse(req.getValidity().getEnd()))
                        .build())
                .status(VoucherStatus.ACTIVE)
                .isStackable(req.getIsStackable() != null ? req.getIsStackable() : false)
                .build();

        Voucher saved = voucherRepository.save(voucher);
        log.info("Admin created voucher: {}", saved.getCode());
        return toResponse(saved);
    }

    // ── ADMIN: Cập nhật voucher ──────────────────────────────────
    public VoucherResponse updateVoucher(String id, UpdateVoucherRequest req) {
        Voucher voucher = findByIdOrThrow(id);

        // Kiểm tra code trùng nếu có thay đổi code
        if (req.getCode() != null && !req.getCode().equalsIgnoreCase(voucher.getCode())) {
            if (voucherRepository.existsByCode(req.getCode().toUpperCase())) {
                throw new AppException(ErrorCode.VOUCHER_CODE_DUPLICATE);
            }
            voucher.setCode(req.getCode().toUpperCase().trim());
        }

        if (req.getName() != null) {
            voucher.setName(req.getName());
        }
        if (req.getVoucherType() != null) {
            voucher.setVoucherType(req.getVoucherType());
        }
        if (req.getDiscountType() != null) {
            voucher.setDiscountType(req.getDiscountType());
        }
        if (req.getDiscountValue() != null) {
            if (voucher.getDiscountType() == DiscountType.PERCENTAGE && req.getDiscountValue() > 100) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Phần trăm giảm không được vượt quá 100");
            }
            voucher.setDiscountValue(req.getDiscountValue());
        }
        if (req.getMaxDiscountAmount() != null) {
            voucher.setMaxDiscountAmount(req.getMaxDiscountAmount());
        }
        if (req.getMinOrderAmount() != null) {
            voucher.setMinOrderAmount(req.getMinOrderAmount());
        }
        if (req.getStatus() != null) {
            voucher.setStatus(req.getStatus());
        }
        if (req.getIsStackable() != null) {
            voucher.setIsStackable(req.getIsStackable());
        }

        // Cập nhật usageLimit nếu có
        if (req.getUsageLimit() != null) {
            UsageLimit current = voucher.getUsageLimit();
            voucher.setUsageLimit(UsageLimit.builder()
                    .total(req.getUsageLimit().getTotal() != null
                            ? req.getUsageLimit().getTotal() : current.getTotal())
                    .perUser(req.getUsageLimit().getPerUser() != null
                            ? req.getUsageLimit().getPerUser() : current.getPerUser())
                    .used(current.getUsed()) // ← giữ nguyên used, không cho phép sửa
                    .build());
        }

        // Cập nhật validity nếu có
        if (req.getValidity() != null) {
            Validity current = voucher.getValidity();
            voucher.setValidity(Validity.builder()
                    .start(req.getValidity().getStart() != null
                            ? Instant.parse(req.getValidity().getStart()) : current.getStart())
                    .end(req.getValidity().getEnd() != null
                            ? Instant.parse(req.getValidity().getEnd()) : current.getEnd())
                    .build());
        }

        voucher.setUpdatedAt(Instant.now());
        Voucher saved = voucherRepository.save(voucher);
        log.info("Admin updated voucher: {}", saved.getCode());
        return toResponse(saved);
    }

    // ── ADMIN: Xóa voucher ───────────────────────────────────────
    public void deleteVoucher(String id) {
        Voucher voucher = findByIdOrThrow(id);
        voucherRepository.delete(voucher);
        log.info("Admin deleted voucher: {}", voucher.getCode());
    }

    // ── ADMIN: Vô hiệu hóa / Khôi phục voucher ──────────────────
    public VoucherResponse toggleStatus(String id) {
        Voucher voucher = findByIdOrThrow(id);
        if (voucher.getStatus() == VoucherStatus.DISABLED) {
            voucher.setStatus(VoucherStatus.ACTIVE);
            log.info("Restored voucher: {}", voucher.getCode());
        } else {
            voucher.setStatus(VoucherStatus.DISABLED);
            log.info("Disabled voucher: {}", voucher.getCode());
        }
        voucher.setUpdatedAt(Instant.now());
        return toResponse(voucherRepository.save(voucher));
    }

    // ── USER: Preview voucher khi checkout (KHÔNG ghi DB, chỉ validate + tính tiền) ──
    // Được gọi khi user chọn/nhập voucher trên trang checkout
    public ApplyVoucherResponse previewVoucher(String clerkId, ApplyVoucherRequest req) {
        // 1. Tìm voucher
        Voucher voucher = voucherRepository.findByCode(req.getCode().toUpperCase().trim())
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        Instant now = Instant.now();

        // 2. Kiểm tra trạng thái
        if (voucher.getStatus() == VoucherStatus.DISABLED) {
            throw new AppException(ErrorCode.VOUCHER_DISABLED);
        }
        if (voucher.getStatus() == VoucherStatus.EXPIRED
                || now.isAfter(voucher.getValidity().getEnd())) {
            throw new AppException(ErrorCode.VOUCHER_EXPIRED);
        }
        if (now.isBefore(voucher.getValidity().getStart())) {
            throw new AppException(ErrorCode.VOUCHER_NOT_STARTED);
        }

        // 3. Kiểm tra giới hạn tổng
        UsageLimit limit = voucher.getUsageLimit();
        if (limit.getUsed() >= limit.getTotal()) {
            throw new AppException(ErrorCode.VOUCHER_EXCEEDED_TOTAL);
        }

        // 4. Kiểm tra giới hạn mỗi user (chỉ check nếu đã đăng nhập)
        if (clerkId != null && !clerkId.startsWith("GUEST_")) {
            long userUsedCount = voucher.getUserUsedList().stream()
                    .filter(uid -> uid.equals(clerkId))
                    .count();
            if (userUsedCount >= limit.getPerUser()) {
                throw new AppException(ErrorCode.VOUCHER_EXCEEDED_PER_USER);
            }
        }

        // 5. Kiểm tra đơn tối thiểu
        if (req.getOrderAmount() < voucher.getMinOrderAmount()) {
            throw new AppException(ErrorCode.VOUCHER_MIN_ORDER_NOT_MET,
                    "Đơn tối thiểu: " + voucher.getMinOrderAmount().longValue() + "₫");
        }

        // 6. Tính tiền giảm
        double discount;
        if (voucher.getDiscountType() == DiscountType.FIXED_AMOUNT) {
            discount = Math.min(voucher.getDiscountValue(), req.getOrderAmount());
        } else {
            discount = req.getOrderAmount() * (voucher.getDiscountValue() / 100.0);
            discount = Math.min(discount, voucher.getMaxDiscountAmount());
        }
        double finalAmount = Math.max(0, req.getOrderAmount() - discount);

        // ✅ KHÔNG ghi DB ở đây — chỉ validate và trả về kết quả tính toán
        log.info("User {} previewed voucher {} | discount: {} (NOT recorded yet)", clerkId, voucher.getCode(), discount);

        return ApplyVoucherResponse.builder()
                .voucher(toResponse(voucher))
                .originalAmount(req.getOrderAmount())
                .discountAmount(discount)
                .finalAmount(finalAmount)
                .message("Voucher " + voucher.getCode() + " hợp lệ!")
                .build();
    }

    // ── USER: Xác nhận sử dụng voucher sau khi đặt hàng thành công (GHI DB) ──
    // Chỉ được gọi sau khi order + payment đã tạo thành công
    public void confirmVoucherUsage(String clerkId, String code, double orderAmount) {
        Voucher voucher = voucherRepository.findByCode(code.toUpperCase().trim())
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        Instant now = Instant.now();

        // Kiểm tra lại lần cuối trước khi ghi
        if (voucher.getStatus() == VoucherStatus.DISABLED) {
            throw new AppException(ErrorCode.VOUCHER_DISABLED);
        }
        if (voucher.getStatus() == VoucherStatus.EXPIRED || now.isAfter(voucher.getValidity().getEnd())) {
            throw new AppException(ErrorCode.VOUCHER_EXPIRED);
        }

        UsageLimit limit = voucher.getUsageLimit();
        if (limit.getUsed() >= limit.getTotal()) {
            throw new AppException(ErrorCode.VOUCHER_EXCEEDED_TOTAL);
        }

        if (clerkId != null && !clerkId.startsWith("GUEST_")) {
            long userUsedCount = voucher.getUserUsedList().stream()
                    .filter(uid -> uid.equals(clerkId))
                    .count();
            if (userUsedCount >= limit.getPerUser()) {
                throw new AppException(ErrorCode.VOUCHER_EXCEEDED_PER_USER);
            }
        }

        // ✅ GHI NHẬN usage vào DB
        if (clerkId != null) {
            voucher.getUserUsedList().add(clerkId);
        }
        voucher.getUsageLimit().setUsed(limit.getUsed() + 1);
        voucher.setUpdatedAt(Instant.now());

        // Tự động EXPIRED nếu đã hết lượt
        if (voucher.getUsageLimit().getUsed() >= voucher.getUsageLimit().getTotal()) {
            voucher.setStatus(VoucherStatus.EXPIRED);
        }

        voucherRepository.save(voucher);
        log.info("✅ Voucher usage confirmed: user={} code={} (total used: {})",
                clerkId, voucher.getCode(), voucher.getUsageLimit().getUsed());
    }

    // ── USER: Kiểm tra voucher hợp lệ (không ghi nhận) ──────────
    public VoucherResponse validateVoucher(String code, Double orderAmount) {
        Voucher voucher = voucherRepository.findByCode(code.toUpperCase().trim())
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        Instant now = Instant.now();
        if (voucher.getStatus() == VoucherStatus.DISABLED) {
            throw new AppException(ErrorCode.VOUCHER_DISABLED);
        }
        if (now.isAfter(voucher.getValidity().getEnd())) {
            throw new AppException(ErrorCode.VOUCHER_EXPIRED);
        }
        if (now.isBefore(voucher.getValidity().getStart())) {
            throw new AppException(ErrorCode.VOUCHER_NOT_STARTED);
        }
        if (voucher.getUsageLimit().getUsed() >= voucher.getUsageLimit().getTotal()) {
            throw new AppException(ErrorCode.VOUCHER_EXCEEDED_TOTAL);
        }
        if (orderAmount != null && orderAmount < voucher.getMinOrderAmount()) {
            throw new AppException(ErrorCode.VOUCHER_MIN_ORDER_NOT_MET,
                    "Đơn tối thiểu: " + voucher.getMinOrderAmount().longValue() + "₫");
        }

        return toResponse(voucher);
    }

    // ── Helper: tự động expire voucher hết hạn ──────────────────
    private void autoExpireVouchers() {
        Instant now = Instant.now();
        List<Voucher> actives = voucherRepository.findByStatus(VoucherStatus.ACTIVE);
        List<Voucher> toExpire = actives.stream()
                .filter(v -> now.isAfter(v.getValidity().getEnd()))
                .peek(v -> {
                    v.setStatus(VoucherStatus.EXPIRED);
                    v.setUpdatedAt(now);
                })
                .collect(Collectors.toList());
        if (!toExpire.isEmpty()) {
            voucherRepository.saveAll(toExpire);
            log.info("Auto-expired {} vouchers", toExpire.size());
        }
    }

    // ── Helper: tìm hoặc throw ───────────────────────────────────
    private Voucher findByIdOrThrow(String id) {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
    }

    // ── Helper: Entity → Response ────────────────────────────────
    public VoucherResponse toResponse(Voucher v) {
        return VoucherResponse.builder()
                .id(v.getId()) // → serialize thành "_id"
                .code(v.getCode())
                .name(v.getName())
                .voucherType(v.getVoucherType())
                .discountType(v.getDiscountType())
                .discountValue(v.getDiscountValue())
                .maxDiscountAmount(v.getMaxDiscountAmount())
                .minOrderAmount(v.getMinOrderAmount())
                .usageLimit(VoucherResponse.UsageLimitDto.builder()
                        .total(v.getUsageLimit().getTotal())
                        .perUser(v.getUsageLimit().getPerUser())
                        .used(v.getUsageLimit().getUsed())
                        .build())
                .validity(VoucherResponse.ValidityDto.builder()
                        .start(v.getValidity().getStart().toString())
                        .end(v.getValidity().getEnd().toString())
                        .build())
                .status(v.getStatus())
                .isStackable(v.getIsStackable())
                .userUsedList(v.getUserUsedList())
                .createdAt(v.getCreatedAt().toString())
                .updatedAt(v.getUpdatedAt().toString())
                .build();
    }

    //thống kê
    public VoucherStats getVoucherStats() {
        List<Voucher> allVouchers = voucherRepository.findAll();

        long totalVouchers = allVouchers.size();
        long active = allVouchers.stream().filter(v -> v.getStatus() == VoucherStatus.ACTIVE).count();
        long expired = allVouchers.stream().filter(v -> v.getStatus() == VoucherStatus.EXPIRED).count();
        long disabled = allVouchers.stream().filter(v -> v.getStatus() == VoucherStatus.DISABLED).count();

        // TỔNG LƯỢT ĐÃ DÙNG CỦA TẤT CẢ VOUCHER
        long totalUsed = allVouchers.stream()
                .mapToLong(v -> v.getUsageLimit().getUsed() != null ? v.getUsageLimit().getUsed() : 0)
                .sum();

        return new VoucherStats(totalVouchers, active, expired, disabled, totalUsed);
    }
}
