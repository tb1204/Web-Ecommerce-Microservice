# 🛒 Cart Service — Tài liệu chi tiết

**Port:** 8083 | **Database:** MongoDB — `cartdb` | **Eureka:** ✅ (nhưng gọi product-service trực tiếp)

---

## Nhiệm vụ

Quản lý giỏ hàng của từng user: thêm, sửa số lượng, xóa, xóa items đã checkout.

---

## Đặc điểm quan trọng

> Cart-service **không dùng Eureka load balancing** để gọi product-service, mà gọi **HTTP trực tiếp** qua URL cố định. Lý do: tránh phức tạp khi cấu hình LoadBalancedRestTemplate.

---

## Luồng hoạt động

### Luồng 1: Thêm sản phẩm vào giỏ

```
Frontend:
POST /api/cart/items
Authorization: Bearer <token>
Body: { productId, variantId, quantity }
         ↓
cart-service extract userId từ JWT
         ↓
Gọi HTTP đến product-service:
GET http://product-service:8082/api/products/detail/{productId}
→ Lấy thông tin: name, price, image, size, thickness, color
         ↓
Tìm Cart của userId trong MongoDB
Nếu item đã có (cùng productId + variantId) → tăng quantity
Nếu chưa có → push item mới vào cart.items[]
         ↓
Lưu MongoDB, trả về CartResponse:
{
  items: [...],
  summary: { subtotal, itemCount }
}
```

### Luồng 2: Xóa items đã checkout (sau khi đặt hàng)

```
CheckoutPage sau khi đặt hàng thành công gọi:
DELETE /api/cart/checkout-items
Body: { variantIds: ["var_001", "var_002"] }
         ↓
cart-service tìm cart của user
Xóa tất cả items có variantId nằm trong danh sách
         ↓
Lưu MongoDB
Trả về cart đã cập nhật
```

### Luồng 3: Lấy giỏ hàng (khi mở CartDrawer / Navbar)

```
GET /api/cart
Authorization: Bearer <token>
         ↓
Tìm Cart theo userId
Nếu chưa có → tạo cart rỗng
         ↓
Trả về { items[], summary: { subtotal } }
```

---

## API Endpoints

| Method | Path                                      | Mô tả                          |
| ------ | ----------------------------------------- | ------------------------------ |
| GET    | `/api/cart`                               | Lấy giỏ hàng của user hiện tại |
| POST   | `/api/cart/items`                         | Thêm item vào giỏ              |
| PATCH  | `/api/cart/items`                         | Cập nhật số lượng item         |
| DELETE | `/api/cart/items/{productId}/{variantId}` | Xóa 1 item                     |
| DELETE | `/api/cart/checkout-items`                | Xóa các item đã checkout       |
| DELETE | `/api/cart/clear`                         | Xóa toàn bộ giỏ                |

---

## Cấu hình application.yml

```yaml
server:
  port: ${SERVER_PORT:8083}

spring:
  application:
    name: cart-service
  data:
    mongodb:
      uri: ${SPRING_DATA_MONGODB_URI:mongodb://localhost:27017/cartdb}

product:
  service:
    url: ${PRODUCT_SERVICE_URL:http://localhost:8082} # ← Override bằng Docker env

eureka:
  client:
    enabled: false # ← Tắt Eureka, gọi trực tiếp
```

---

---
