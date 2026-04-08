# 👤 User Service — Tài liệu chi tiết

**Port:** 8081  
**Database:** MongoDB — `userdb`  
**Đăng ký Eureka:** ✅ Có

---

## Nhiệm vụ

User Service chịu trách nhiệm:

1. **Đồng bộ user** từ Clerk (khi user đăng nhập lần đầu, Clerk webhook gọi về để tạo user trong DB nội bộ)
2. **Lưu thông tin bổ sung** của user: số điện thoại, địa chỉ mà Clerk không lưu
3. **Quản lý Wishlist** — danh sách sản phẩm yêu thích của mỗi user
4. **Xác thực role** — phân biệt `user` vs `admin`

---

## Luồng hoạt động chi tiết

### Luồng 1: User đăng nhập lần đầu (Clerk Webhook)

```
User đăng nhập qua Clerk (Google / Email)
         ↓
Clerk gửi webhook event "user.created" đến:
POST /api/users/webhook (user-service)
         ↓
user-service nhận payload từ Clerk:
{
  "id": "user_2abc...",   ← clerkId
  "email_addresses": [...],
  "first_name": "Nguyễn",
  "last_name": "An"
}
         ↓
Tạo document mới trong MongoDB userdb:
{
  clerkId: "user_2abc...",
  email: "nguyen@gmail.com",
  firstName: "Nguyễn",
  lastName: "An",
  role: "user",
  wishlist: [],
  createdAt: ...
}
```

### Luồng 2: Lấy thông tin user hiện tại

```
Frontend gửi:
GET /api/users/me
Authorization: Bearer <clerk_jwt>
         ↓
user-service verify JWT (Clerk public key)
Extract clerkId từ token
         ↓
Tìm user trong MongoDB theo clerkId
         ↓
Trả về UserResponse:
{
  clerkId, email, firstName, lastName,
  phone, role, avatarUrl
}
```

### Luồng 3: Quản lý Wishlist

```
── Xem wishlist ──
GET /api/users/me/wishlist
→ Lấy danh sách productId từ user.wishlist[]
→ Gọi product-service để lấy chi tiết từng sản phẩm (nếu có)
→ Trả về danh sách Product[]

── Thêm vào wishlist ──
POST /api/users/me/wishlist/{productId}
→ Kiểm tra productId chưa có trong wishlist
→ Push productId vào mảng wishlist của user
→ Lưu MongoDB

── Xóa khỏi wishlist ──
DELETE /api/users/me/wishlist/{productId}
→ Pull productId khỏi mảng wishlist
→ Lưu MongoDB
```

---

## API Endpoints

| Method | Path                                 | Auth     | Mô tả                               |
| ------ | ------------------------------------ | -------- | ----------------------------------- |
| POST   | `/api/users/webhook`                 | —        | Nhận webhook từ Clerk               |
| GET    | `/api/users/me`                      | ✅ JWT   | Lấy thông tin user đang đăng nhập   |
| PUT    | `/api/users/me`                      | ✅ JWT   | Cập nhật thông tin (phone, address) |
| GET    | `/api/users/me/wishlist`             | ✅ JWT   | Lấy danh sách yêu thích             |
| POST   | `/api/users/me/wishlist/{productId}` | ✅ JWT   | Thêm vào wishlist                   |
| DELETE | `/api/users/me/wishlist/{productId}` | ✅ JWT   | Xóa khỏi wishlist                   |
| GET    | `/api/admin/users`                   | ✅ ADMIN | Lấy tất cả users (admin)            |

---

## Cấu trúc MongoDB Document

```json
{
  "_id": "ObjectId(...)",
  "clerkId": "user_2abc123def",
  "email": "nguyen@gmail.com",
  "firstName": "Nguyễn",
  "lastName": "An",
  "phone": "0901234567",
  "avatarUrl": "https://...",
  "role": "user",
  "wishlist": ["productId1", "productId2"],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:00:00Z"
}
```

---

## Cấu hình application.yml cho Docker

```yaml
server:
  port: ${SERVER_PORT:8081}

spring:
  application:
    name: user-service
  data:
    mongodb:
      uri: ${SPRING_DATA_MONGODB_URI:mongodb://localhost:27017/userdb}

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:http://localhost:8761/eureka/}
  instance:
    prefer-ip-address: true # ← QUAN TRỌNG khi chạy Docker
```

> **Lưu ý `prefer-ip-address: true`**: Khi chạy Docker, Eureka cần biết IP thực của container, không phải hostname máy host. Thêm dòng này vào tất cả service.

---

## Dockerfile mẫu (dùng cho tất cả Spring Boot service)

```dockerfile
# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```
