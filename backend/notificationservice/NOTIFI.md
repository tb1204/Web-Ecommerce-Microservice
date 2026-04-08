# 🔔 Notification Service — Tài liệu chi tiết

**Port:** 8087 | **Database:** MongoDB — `notificationdb` | **Eureka:** ✅ | **RabbitMQ:** ✅ Consumer | **WebSocket:** ✅

---

## Nhiệm vụ

Nhận events từ RabbitMQ → Lưu notification → Push realtime đến browser qua WebSocket.

---

## Luồng hoạt động

### Luồng 1: Nhận event từ RabbitMQ

```
order-service publish:
Exchange: "order.exchange"
RoutingKey: "order.status.changed"
Message: {
  userId: "user_2abc...",
  orderId: "...",
  orderNumber: "ORD-001",
  newStatus: "SHIPPING",
  message: "Đơn hàng ORD-001 đang được vận chuyển"
}
         ↓
notification-service @RabbitListener lắng nghe
         ↓
1. Tạo Notification document trong MongoDB:
   { userId, type: "ORDER", message, orderId, status: "UNREAD" }
2. Push qua WebSocket đến /topic/notifications/{userId}
```

### Luồng 2: Browser kết nối WebSocket

```
Frontend (React):
const socket = new SockJS("http://localhost:8087/ws-notifications");
const stompClient = Stomp.over(socket);
stompClient.connect({}, () => {
  stompClient.subscribe(`/topic/notifications/${userId}`, (msg) => {
    const noti = JSON.parse(msg.body);
    // Hiển thị toast + cập nhật unread count
  });
});
```

### Luồng 3: Đánh dấu đã đọc

```
User click vào notification:
PUT /api/notifications/{id}/read
         ↓
Cập nhật status: "UNREAD" → "READ"
Giảm unreadCount trên Navbar
```

---

## API Endpoints

| Method | Path                               | Mô tả                  |
| ------ | ---------------------------------- | ---------------------- |
| GET    | `/api/notifications/user/{userId}` | Lấy thông báo của user |
| PUT    | `/api/notifications/{id}/read`     | Đánh dấu đã đọc        |
| DELETE | `/api/notifications/{id}`          | Xóa thông báo          |

**WebSocket endpoint:** `ws://localhost:8087/ws-notifications`  
**Subscribe topic:** `/topic/notifications/{userId}`

---

---
