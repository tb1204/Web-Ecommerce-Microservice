# 🏗️ ARTISANO — Kiến trúc Microservices

## Tổng quan hệ thống

Artisano là hệ thống thương mại điện tử bán đồ dùng phòng ngủ (chăn, gối, nệm) được xây dựng theo kiến trúc **Microservices** với **Spring Boot** ở backend và **React + TypeScript** ở frontend.

---

## Sơ đồ kiến trúc

```
                        ┌─────────────────┐
                        │   React Frontend │
                        │   (Vite + Redux) │
                        └────────┬────────┘
                                 │ HTTP / WebSocket
                                 ▼
                        ┌─────────────────┐
                        │   API Gateway   │  :8080
                        │ (Spring Cloud)  │
                        └────────┬────────┘
                                 │ Route theo path
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
    /api/users             /api/products           /api/cart
          │                      │                      │
          ▼                      ▼                      ▼
  ┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
  │ user-service │    │ product-service  │    │ cart-service │
  │    :8081     │    │     :8082        │    │    :8083     │
  └──────────────┘    └──────────────────┘    └──────┬───────┘
                                                     │ HTTP direct
                                                     ▼
                                            product-service:8082

    /api/orders          /api/payments        /api/notifications
          │                      │                      │
          ▼                      ▼                      ▼
  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────────┐
  │order-service │    │payment-service   │    │notification-service  │
  │    :8084     │    │     :8085        │    │       :8087          │
  └──────┬───────┘    └────────┬─────────┘    └──────────┬───────────┘
         │                     │                         │
         └─────────────────────┼─────────────────────────┘
                               │
                         ┌─────▼─────┐
                         │ RabbitMQ  │  :5672
                         │  (Queue)  │
                         └───────────┘

    /api/reviews         /api/vouchers
          │                      │
          ▼                      ▼
  ┌──────────────┐    ┌──────────────────┐
  │review-service│    │ voucher-service  │
  │    :8088     │    │     :8089        │
  └──────────────┘    └──────────────────┘

                 ┌─────────────────────────────┐
                 │     Eureka Discovery Server  │  :8761
                 │  (Tất cả service đăng ký)   │
                 └─────────────────────────────┘

                 ┌─────────────────────────────┐
                 │         MongoDB             │  :27017
                 │  (Mỗi service 1 database)   │
                 └─────────────────────────────┘
```

---

## Danh sách các Service

| Service | Port | Database | Mô tả |
|---------|------|----------|-------|
| **eureka-server** | 8761 | — | Service Discovery |
| **api-gateway** | 8080 | — | Cổng vào duy nhất |
| **user-service** | 8081 | userdb | Quản lý user, wishlist, auth |
| **product-service** | 8082 | productdb | Quản lý sản phẩm, danh mục |
| **cart-service** | 8083 | cartdb | Quản lý giỏ hàng |
| **order-service** | 8084 | orderdb | Quản lý đơn hàng |
| **payment-service** | 8085 | paymentdb | Xử lý thanh toán, VNPay |
| **notification-service** | 8087 | notificationdb | Thông báo realtime (WebSocket) |
| **review-service** | 8088 | reviewdb | Đánh giá sản phẩm |
| **voucher-service** | 8089 | voucherdb | Quản lý mã giảm giá |
| **frontend** | 5173 | — | React SPA |

---

## Công nghệ sử dụng

### Backend
- **Spring Boot 3.3.5** — Framework chính
- **Spring Cloud 2023.0.3** — Eureka, Gateway, LoadBalancer
- **Spring Data MongoDB** — ORM cho MongoDB
- **Spring AMQP (RabbitMQ)** — Message broker cho event-driven
- **Spring WebSocket + STOMP** — Realtime notifications
- **Clerk JWT** — Authentication (verify token từ Clerk)

### Frontend
- **React 18 + TypeScript** — UI Framework
- **Vite** — Build tool
- **Redux Toolkit** — State management
- **Clerk** — Authentication provider
- **Tailwind CSS** — Styling
- **Axios** — HTTP client
- **SockJS + STOMP** — WebSocket client

### Infrastructure
- **MongoDB 7.0** — NoSQL database
- **RabbitMQ 3.13** — Message broker
- **Docker + Docker Compose** — Containerization
- **Nginx** — Serve frontend static files

---

## Luồng Authentication

```
Browser → Clerk (đăng nhập) → Nhận JWT token
     ↓
Mỗi request gửi lên API Gateway kèm: Authorization: Bearer <clerk_jwt>
     ↓
API Gateway → Forward request đến service tương ứng
     ↓
Từng service verify JWT với Clerk public key
     ↓
Extract userId từ token → Xử lý business logic
```

---

## Luồng Event-Driven (RabbitMQ)

```
order-service  →  publish OrderCreatedEvent  →  RabbitMQ
payment-service →  publish PaymentCompletedEvent → RabbitMQ
                                                      ↓
                                          notification-service subscribe
                                                      ↓
                                          Lưu notification vào MongoDB
                                          Push realtime qua WebSocket đến browser
```

---

## Cách chạy với Docker

```bash
# 1. Build và khởi động toàn bộ hệ thống
docker-compose up --build -d

# 2. Xem logs
docker-compose logs -f

# 3. Xem logs một service cụ thể
docker-compose logs -f order-service

# 4. Dừng toàn bộ
docker-compose down

# 5. Dừng và xóa volumes (reset data)
docker-compose down -v
```

### URL truy cập sau khi chạy
- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:8080
- **Eureka Dashboard:** http://localhost:8761
- **RabbitMQ Management:** http://localhost:15672 (guest/guest)

---

## Các thay đổi cần làm khi deploy Docker

### 1. Đổi `localhost` → container name trong các service

| Service | Cấu hình cũ | Cấu hình mới |
|---------|-------------|--------------|
| cart-service | `http://localhost:8082` | `http://product-service:8082` |
| order-service | `http://localhost:8082` | `http://product-service:8082` |
| payment-service | `http://localhost:8084` | `http://order-service:8084` |

### 2. Biến môi trường cần override trong Docker

Tất cả URL hardcode trong `application.yml` cần đổi thành **Environment Variable** để Docker override được.

**Ví dụ trong `application.yml` của cart-service:**
```yaml
# TRƯỚC (hardcode):
product:
  service:
    url: http://localhost:8082

# SAU (dùng env var với fallback):
product:
  service:
    url: ${PRODUCT_SERVICE_URL:http://localhost:8082}
```

**Docker Compose sẽ override:**
```yaml
environment:
  PRODUCT_SERVICE_URL: http://product-service:8082
```

### 3. MongoDB connection string

```yaml
# TRƯỚC:
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/cartdb

# SAU:
spring:
  data:
    mongodb:
      uri: ${SPRING_DATA_MONGODB_URI:mongodb://localhost:27017/cartdb}
```