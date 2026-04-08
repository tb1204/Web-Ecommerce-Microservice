# 🚪 API Gateway — Tài liệu chi tiết

**Port:** 8080 | **Eureka:** ✅ Client | **Vai trò:** Cổng vào duy nhất của hệ thống

---

## Nhiệm vụ

1. **Routing** — Chuyển request đúng service dựa vào path prefix
2. **Load Balancing** — Phân tải nếu có nhiều instance của 1 service
3. **CORS** — Cấu hình tập trung, không cần cấu hình từng service
4. **Authentication Filter** (optional) — Verify JWT trước khi forward

---

## Luồng routing

```
Browser gửi:
GET http://localhost:8080/api/products/all
         ↓
API Gateway nhận request
Đọc path prefix: /api/products/...
         ↓
Lookup Eureka: service "product-service" đang ở đâu?
Eureka trả về: http://product-service:8082
         ↓
API Gateway forward:
GET http://product-service:8082/api/products/all
         ↓
product-service xử lý, trả về response
         ↓
API Gateway trả về cho Browser
```

---

## Cấu hình application.yml cho API Gateway

```yaml
server:
  port: ${SERVER_PORT:8080}

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      # ─── CORS (cấu hình tập trung) ──────────────────────────
      globalcors:
        cors-configurations:
          "[/**]":
            allowedOrigins:
              - "http://localhost:5173" # Frontend dev
              - "http://localhost:80" # Frontend Docker
            allowedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
            allowedHeaders: ["*"]
            allowCredentials: true

      # ─── Routes ──────────────────────────────────────────────
      routes:
        # User Service
        - id: user-service
          uri: lb://user-service # lb:// = load balanced qua Eureka
          predicates:
            - Path=/api/users/**

        # Product Service
        - id: product-service
          uri: lb://product-service
          predicates:
            - Path=/api/products/**, /api/categories/**

        # Cart Service
        - id: cart-service
          uri: lb://cart-service
          predicates:
            - Path=/api/cart/**

        # Order Service
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**

        # Payment Service
        - id: payment-service
          uri: lb://payment-service
          predicates:
            - Path=/api/payments/**

        # Notification Service (REST)
        - id: notification-service
          uri: lb://notification-service
          predicates:
            - Path=/api/notifications/**

        # Notification Service (WebSocket)
        - id: notification-ws
          uri: lb:ws://notification-service # ws:// để proxy WebSocket
          predicates:
            - Path=/ws-notifications/**

        # Review Service
        - id: review-service
          uri: lb://review-service
          predicates:
            - Path=/api/reviews/**

        # Voucher Service
        - id: voucher-service
          uri: lb://voucher-service
          predicates:
            - Path=/api/vouchers/**, /api/admin/vouchers/**

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:http://localhost:8761/eureka/}
  instance:
    prefer-ip-address: true
```

---

## Thay đổi quan trọng khi chuyển Docker

### Frontend phải gọi qua Gateway

Khi deploy Docker, frontend **không được gọi trực tiếp** vào từng service nữa. Tất cả đổi về `http://api-gateway:8080`:

```typescript
// Trước (dev):
const ORDER_URL = "http://localhost:8084";
const USER_URL = "http://localhost:8081";

// Sau (Docker, dùng env var):
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const ORDER_URL = API_BASE;
const USER_URL = API_BASE;
// Tất cả path vẫn giữ nguyên: /api/orders/..., /api/users/...
// Gateway sẽ tự route đúng service
```

---

## pom.xml cần có cho API Gateway

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<!-- QUAN TRỌNG: Gateway dùng WebFlux, KHÔNG dùng spring-boot-starter-web -->
```

> ⚠️ **Lưu ý:** API Gateway dùng **Spring WebFlux** (reactive), KHÔNG thêm `spring-boot-starter-web` vào pom.xml — sẽ conflict.

---

---

# 🔍 Discovery Server (Eureka) — Tài liệu chi tiết

**Port:** 8761 | **Vai trò:** Service Registry

---

## Nhiệm vụ

Eureka Server là "danh bạ điện thoại" của hệ thống microservices:

- Tất cả service **đăng ký** tên và địa chỉ (IP:Port) của mình khi khởi động
- Khi service A muốn gọi service B, tra cứu Eureka để biết địa chỉ của B
- **Heartbeat:** Mỗi 30 giây, service gửi ping lên Eureka. Nếu mất 3 lần ping → Eureka đánh dấu service đó là DOWN

---

## Luồng đăng ký service

```
product-service khởi động
         ↓
Đọc config: eureka.client.service-url.defaultZone
         ↓
Gửi POST đến Eureka:
"Tôi là product-service, đang chạy tại 172.20.0.5:8082"
         ↓
Eureka lưu vào registry:
{
  "product-service": [
    { "host": "172.20.0.5", "port": 8082, "status": "UP" }
  ]
}
```

## Luồng discovery khi API Gateway routing

```
API Gateway nhận request: GET /api/products/all
         ↓
Đọc route config: uri: lb://product-service
         ↓
Gọi Eureka: "Địa chỉ của product-service là gì?"
         ↓
Eureka trả về: 172.20.0.5:8082
         ↓
API Gateway forward request đến 172.20.0.5:8082
```

---

## Dashboard Eureka

Truy cập `http://localhost:8761` để xem trạng thái tất cả service:

```
Application         AMIs    Availability Zones    Status
──────────────────────────────────────────────────────────
USER-SERVICE         n/a    (1)                   UP (1)
PRODUCT-SERVICE      n/a    (1)                   UP (1)
CART-SERVICE         n/a    (1)                   UP (1)
ORDER-SERVICE        n/a    (1)                   UP (1)
PAYMENT-SERVICE      n/a    (0)                   ← Tắt Eureka
NOTIFICATION-SERVICE n/a    (1)                   UP (1)
REVIEW-SERVICE       n/a    (1)                   UP (1)
VOUCHER-SERVICE      n/a    (1)                   UP (1)
API-GATEWAY          n/a    (1)                   UP (1)
```

---

## Dockerfile cho Discovery Server

```dockerfile
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

---

# 🌐 Frontend Dockerfile

```dockerfile
# Stage 1: Build React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# VITE_API_BASE_URL sẽ được inject lúc build
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Serve với Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing — mọi path đều trả về index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls đến Gateway (tránh CORS)
    location /api/ {
        proxy_pass http://api-gateway:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket proxy
    location /ws-notifications/ {
        proxy_pass http://api-gateway:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

---

# ✅ Checklist trước khi deploy Docker

## Backend — Mỗi service cần làm:

- [ ] Thêm `prefer-ip-address: true` vào eureka.instance config
- [ ] Đổi tất cả URL hardcode `localhost:PORT` → dùng `${ENV_VAR:default}`
- [ ] Thêm `spring-boot-starter-actuator` để healthcheck hoạt động
- [ ] Viết `Dockerfile` theo multi-stage build

## Cụ thể từng service:

| Service           | Việc cần làm                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| cart-service      | Đổi `http://localhost:8082` → `${PRODUCT_SERVICE_URL:http://localhost:8082}`                                                              |
| order-service     | Đổi `http://localhost:8082` → `${PRODUCT_SERVICE_URL:http://localhost:8082}`                                                              |
| payment-service   | Đổi `http://localhost:8084` → `${ORDER_SERVICE_URL:http://localhost:8084}` + thêm `eureka.client.enabled: ${EUREKA_CLIENT_ENABLED:false}` |
| Tất cả service    | Đổi MongoDB URI → `${SPRING_DATA_MONGODB_URI:mongodb://localhost:27017/...}`                                                              |
| Tất cả service    | Đổi Eureka URL → `${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:http://localhost:8761/eureka/}`                                                  |
| RabbitMQ services | Đổi `localhost` → `${SPRING_RABBITMQ_HOST:rabbitmq}`                                                                                      |

## Frontend:

- [ ] Đổi tất cả URL hardcode → dùng `import.meta.env.VITE_API_BASE_URL`
- [ ] Viết `Dockerfile` + `nginx.conf`
- [ ] Tạo `.env.production`: `VITE_API_BASE_URL=http://localhost:8080`
