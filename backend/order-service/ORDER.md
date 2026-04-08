# 📋 Order Service — Tài liệu chi tiết

**Port:** 8084 | **Database:** MongoDB — `orderdb` | **Eureka:** ✅ | **RabbitMQ:** ✅ Publisher

---

## Nhiệm vụ

Tạo và quản lý đơn hàng, cập nhật trạng thái, thống kê doanh thu.

---

## Luồng hoạt động

### Luồng 1: Tạo đơn hàng mới

```
CheckoutPage gọi:
POST /api/orders/add
Body: {
  userId, name, phone, email,
  shippingAddress, note, paymentMethod,
  items: [{ productId, variantId, quantity }]
}
         ↓
order-service:
1. Generate orderNumber: "ORD-20241215-001"
2. Với mỗi item → gọi product-service lấy:
   - price, productImage, size, thickness, color, name
3. Tính totalAmount = sum(price * quantity)
4. Tạo Order document trong MongoDB:
   {
     orderNumber, userId, customerInfo: {name, phone, email},
     shippingAddress, items[], totalAmount,
     orderStatus: "PENDING",
     paymentMethod, paymentStatus: "PENDING"
   }
5. Publish OrderCreatedEvent → RabbitMQ
   → notification-service lắng nghe và gửi thông báo
6. Trả về OrderResponse với orderId
```

### Luồng 2: Cập nhật trạng thái thanh toán (VNPay callback)

```
payment-service sau khi nhận VNPay callback gọi:
PATCH /api/orders/payment-status/{orderNumber}
Body: { paymentStatus: "PAID" }
         ↓
order-service:
- Tìm order theo orderNumber
- Cập nhật paymentStatus = "PAID"
- Cập nhật orderStatus = "CONFIRMED"
- Gọi product-service: PATCH /variants/{variantId}/stock (trừ tồn kho)
- Publish OrderConfirmedEvent → RabbitMQ
```

### Luồng 3: Admin cập nhật trạng thái đơn hàng

```
Admin dashboard:
PATCH /api/orders/{orderId}/status
Body: { status: "SHIPPING" }
         ↓
Trạng thái hợp lệ:
PENDING → CONFIRMED → SHIPPING → DELIVERED → CANCELLED

Mỗi thay đổi trạng thái:
→ Publish OrderStatusChangedEvent → RabbitMQ
→ notification-service push thông báo realtime đến user
```

---

## Trạng thái đơn hàng

```
PENDING     → Vừa tạo, chờ thanh toán
CONFIRMED   → Đã thanh toán / Admin xác nhận
SHIPPING    → Đang vận chuyển
DELIVERED   → Đã giao hàng
CANCELLED   → Đã hủy
```

---

## API Endpoints

| Method | Path                                       | Auth     | Mô tả                 |
| ------ | ------------------------------------------ | -------- | --------------------- |
| POST   | `/api/orders/add`                          | ✅ User  | Tạo đơn hàng mới      |
| GET    | `/api/orders/{id}`                         | ✅ User  | Lấy chi tiết đơn hàng |
| GET    | `/api/orders/user/{userId}`                | ✅ User  | Đơn hàng của user     |
| GET    | `/api/orders/my`                           | ✅ User  | Đơn hàng của tôi      |
| PATCH  | `/api/orders/payment-status/{orderNumber}` | Internal | Cập nhật thanh toán   |
| PATCH  | `/api/orders/{id}/status`                  | ✅ Admin | Cập nhật trạng thái   |
| GET    | `/api/orders/all`                          | ✅ Admin | Tất cả đơn hàng       |
| GET    | `/api/orders/stats`                        | ✅ Admin | Thống kê doanh thu    |

---

---

# 💳 Payment Service — Tài liệu chi tiết

**Port:** 8085 | **Database:** MongoDB — `paymentdb` | **Eureka:** ❌ (tắt) | **RabbitMQ:** ✅ Publisher

---

## Nhiệm vụ

Tạo payment record, tích hợp VNPay sandbox, nhận callback từ VNPay, cập nhật trạng thái thanh toán.

---

## Luồng hoạt động

### Luồng 1: Tạo payment (COD)

```
CheckoutPage:
POST /api/payments
Body: { orderId, paymentMethod: "COD", amount, clientIp }
         ↓
payment-service:
1. Tạo Payment document:
   { orderId, method: "COD", amount, status: "PENDING" }
2. Với COD không cần redirect → trả về:
   { paymentId, paymentUrl: null, status: "PENDING" }
         ↓
Frontend nhận → navigate đến trang success
```

### Luồng 2: Tạo payment (VNPay)

```
CheckoutPage:
POST /api/payments
Body: { orderId, paymentMethod: "VNPAY", amount, clientIp }
         ↓
payment-service:
1. Tạo Payment document với status: "PENDING"
2. Gọi VNPay SDK để tạo payment URL:
   - vnp_TmnCode (merchant code)
   - vnp_Amount (amount * 100)
   - vnp_ReturnUrl: http://localhost:8085/api/payments/vnpay/return
   - vnp_TxnRef: orderId
   - vnp_SecureHash (HMAC-SHA512)
3. Trả về { paymentUrl: "https://sandbox.vnpayment.vn/..." }
         ↓
Frontend: window.location.href = paymentUrl
User được redirect đến VNPay sandbox
```

### Luồng 3: VNPay Callback (sau thanh toán)

```
VNPay redirect về:
GET /api/payments/vnpay/return?vnp_ResponseCode=00&vnp_TxnRef=orderId&...
         ↓
payment-service:
1. Verify vnp_SecureHash để đảm bảo không bị giả mạo
2. Nếu vnp_ResponseCode == "00" (thành công):
   - Cập nhật Payment.status = "PAID"
   - Gọi order-service:
     PATCH /api/orders/payment-status/{orderNumber}
     Body: { paymentStatus: "PAID" }
   - Publish PaymentSuccessEvent → RabbitMQ
3. Nếu thất bại:
   - Cập nhật Payment.status = "FAILED"
   - Publish PaymentFailedEvent → RabbitMQ
4. Redirect về frontend:
   - Thành công: http://frontend/payment-success?orderId=...
   - Thất bại: http://frontend/payment-failed?orderId=...
```

---

## API Endpoints

| Method | Path                            | Auth    | Mô tả                      |
| ------ | ------------------------------- | ------- | -------------------------- |
| POST   | `/api/payments`                 | ✅ User | Tạo payment mới            |
| GET    | `/api/payments/order/{orderId}` | ✅ User | Lấy payment theo orderId   |
| GET    | `/api/payments/vnpay/return`    | Public  | VNPay callback (permitAll) |

---

## Cấu hình application.yml

```yaml
server:
  port: ${SERVER_PORT:8085}

vnpay:
  tmn-code: ${VNPAY_TMN_CODE:YOUR_TMN_CODE}
  hash-secret: ${VNPAY_HASH_SECRET:YOUR_HASH_SECRET}
  url: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
  return-url: ${VNPAY_RETURN_URL:http://localhost:8085/api/payments/vnpay/return}

order:
  service:
    url: ${ORDER_SERVICE_URL:http://localhost:8084}

eureka:
  client:
    enabled: ${EUREKA_CLIENT_ENABLED:false}
```

---

---
