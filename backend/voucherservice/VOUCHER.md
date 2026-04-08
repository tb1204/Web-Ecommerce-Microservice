# 🎟️ Voucher Service — Tài liệu chi tiết

**Port:** 8089 | **Database:** MongoDB — `voucherdb` | **Eureka:** ✅

---

## Nhiệm vụ

Quản lý mã giảm giá (voucher): tạo, kích hoạt/tắt, áp dụng khi checkout.

---

## Luồng hoạt động

### Luồng 1: Áp dụng voucher tại checkout

```
User nhập mã voucher tại CheckoutPage:
POST /api/vouchers/apply
Body: { code: "SALE20", orderAmount: 2000000 }
         ↓
voucher-service:
1. Tìm voucher theo code (case-insensitive)
2. Kiểm tra:
   - Voucher tồn tại?
   - Còn hạn? (expireDate > now)
   - Còn lượt dùng? (usedCount < maxUsage)
   - Đơn hàng đủ điều kiện? (orderAmount >= minOrderAmount)
   - Voucher đang active?
3. Tính discountAmount:
   - PERCENT: orderAmount * discountValue / 100
   - FIXED: discountValue
4. Trả về: { voucher, discountAmount }
```

### Luồng 2: Admin quản lý voucher

```
POST /api/admin/vouchers    → Tạo voucher mới
PUT  /api/admin/vouchers/{id} → Sửa voucher
PATCH /api/admin/vouchers/{id}/toggle-status → Bật/tắt
DELETE /api/admin/vouchers/{id} → Xóa
```

---

## Cấu trúc Voucher Document

```json
{
  "_id": "ObjectId(...)",
  "code": "SALE20",
  "name": "Giảm 20% cho đơn từ 1 triệu",
  "voucherType": "PERCENT",
  "discountValue": 20,
  "minOrderAmount": 1000000,
  "maxDiscountAmount": 500000,
  "maxUsage": 100,
  "usedCount": 15,
  "startDate": "2024-12-01",
  "expireDate": "2024-12-31",
  "isActive": true
}
```

---

## API Endpoints

| Method | Path                                     | Auth     | Mô tả                       |
| ------ | ---------------------------------------- | -------- | --------------------------- |
| POST   | `/api/vouchers/apply`                    | ✅ User  | Kiểm tra và áp dụng voucher |
| GET    | `/api/admin/vouchers`                    | ✅ Admin | Tất cả vouchers             |
| GET    | `/api/admin/vouchers/stats`              | ✅ Admin | Thống kê voucher            |
| POST   | `/api/admin/vouchers`                    | ✅ Admin | Tạo voucher mới             |
| PUT    | `/api/admin/vouchers/{id}`               | ✅ Admin | Sửa voucher                 |
| PATCH  | `/api/admin/vouchers/{id}/toggle-status` | ✅ Admin | Bật/tắt                     |
| DELETE | `/api/admin/vouchers/{id}`               | ✅ Admin | Xóa                         |
