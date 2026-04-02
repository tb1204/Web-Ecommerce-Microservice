package com.b2204925.voucherservice.repository;

import com.b2204925.voucherservice.entity.Voucher;
import com.b2204925.voucherservice.entity.VoucherStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface VoucherRepository extends MongoRepository<Voucher, String> {

    Optional<Voucher> findByCode(String code);
    // Tìm theo mã code — dùng khi user apply

    boolean existsByCode(String code);
    // Kiểm tra code trùng khi admin tạo mới

    List<Voucher> findByStatus(VoucherStatus status);
    // Lọc theo trạng thái — ACTIVE / EXPIRED / DISABLED

    List<Voucher> findAllByOrderByCreatedAtDesc();
    // Admin lấy tất cả, mới nhất lên đầu
}
