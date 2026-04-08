# ⭐ Review Service — Tài liệu chi tiết

**Port:** 8088 | **Database:** MongoDB — `reviewdb` | **Eureka:** ✅

---

## Nhiệm vụ

Quản lý đánh giá sản phẩm từ người dùng, moderation bởi admin.

---

## Luồng hoạt động

### Luồng 1: User gửi đánh giá

```
Sau khi nhận hàng (status = DELIVERED), user vào trang sản phẩm:
POST /api/reviews/create
Authorization: Bearer <token>
Body: { productId, rating: 5, comment: "Sản phẩm rất tốt!" }
         ↓
review-service:
1. Verify user đã mua sản phẩm này (optional, gọi order-service check)
2. Tạo Review document với status: "PENDING"
3. Trả về review đã tạo
```

### Luồng 2: Admin duyệt đánh giá

```
Admin dashboard:
PATCH /api/reviews/{reviewId}/status
Body: { status: "APPROVED" }  hoặc "REJECTED"
         ↓
Chỉ review APPROVED mới hiển thị trên trang sản phẩm
```

### Luồng 3: Hiển thị đánh giá trên trang sản phẩm

```
GET /api/reviews/product/{productId}
→ Chỉ trả về reviews có status = "APPROVED"
→ Frontend tính average rating
→ Hiển thị danh sách reviews
```

---

## API Endpoints

| Method | Path                               | Auth     | Mô tả                   |
| ------ | ---------------------------------- | -------- | ----------------------- |
| GET    | `/api/reviews/product/{productId}` | —        | Reviews đã duyệt của SP |
| POST   | `/api/reviews/create`              | ✅ User  | Gửi đánh giá            |
| GET    | `/api/reviews/all`                 | ✅ Admin | Tất cả reviews          |
| PATCH  | `/api/reviews/{id}/status`         | ✅ Admin | Duyệt / từ chối         |
| DELETE | `/api/reviews/{id}`                | ✅ Admin | Xóa review              |

---

---
