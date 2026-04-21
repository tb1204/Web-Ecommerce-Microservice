# Giải Thích Chi Tiết File `WebhookController.java`

File `WebhookController.java` đóng vai trò là cầu nối (Webhook Listener) giữa hệ thống xác thực **Clerk** và hệ thống backend (Database) của bạn. Khi có bất kỳ sự kiện nào xảy ra bên phía Clerk (như một người đăng ký mới, cập nhật tên/ảnh đại diện, hoặc bị xóa tài khoản), Clerk sẽ bắn một HTTP POST Request chứa thông tin sự kiện đó về địa chỉ API này.

Dưới đây là giải thích chi tiết theo từng phần trong file:

## 1. Khai báo Class & Endpoint API
```java
@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class WebhookController {
    // ...
    @Value("${clerk.webhook-signing-secret}")
    private String signingSecret;
}
```
- **`@RestController` & `@RequestMapping("/api/webhook")`**: Định nghĩa class này là một API Controller, với đường dẫn gốc là `/api/webhook`.
- **`@RequiredArgsConstructor`**: Lombok tự động tạo constructor để tiêm (inject) các bean cần thiết như `UserRepository`, `ObjectMapper`, và `ClerkService`.
- **`signingSecret`**: Chuỗi bí mật cấu hình trong `application.yml` (hoặc biến môi trường), dùng để xác minh xem request đẩy tới có thực sự là từ Clerk hay từ Hacker.

---

## 2. Hàm Chính: `handleClerkWebhook`
Đây là hàm nhận trực tiếp Request từ Clerk gởi đến thông qua đường dẫn `POST /api/webhook/clerk`.
```java
@PostMapping("/clerk")
public ResponseEntity<String> handleClerkWebhook(
        @RequestHeader("svix-id") String svixId,
        @RequestHeader("svix-timestamp") String svixTimestamp,
        @RequestHeader("svix-signature") String svixSignature,
        @RequestBody String payload)
```
Clerk sử dụng nền tảng **Svix** để quản lý Webhook, nên nó sẽ truyền kèm 3 headers bắt buộc là `svix-id` (ID của event), `svix-timestamp` (Thời gian gửi) và `svix-signature` (Chữ ký điện tử). `payload` chứa chuỗi JSON đại diện cho toàn bộ thông tin sự kiện.

### 2.1. Chống Tấn Công Replay Attack (Phát lại)
```java
long timestamp = Long.parseLong(svixTimestamp);
long now = Instant.now().getEpochSecond();
if (Math.abs(now - timestamp) > 300) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid timestamp");
}
```
Mã nguồn so sánh thời điểm Clerk gửi request (`svixTimestamp`) so với thời gian hiện tại của Server (`now`). Nếu khoảng cách > 300 giây (5 phút) => Request quá hạn và bị từ chối. Điều này ngăn chặn hacker bắt lại gói tin mạng rồi gửi liên tục vào server của bạn.

### 2.2. Xác Thực Chữ Ký (Verify Signature)
```java
if (!verifySignature(svixId, svixTimestamp, payload, svixSignature)) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
}
```
Gọi xuống hàm `verifySignature()` (phân tích chi tiết ở Mục 5) để mã hóa Hash HMAC-SHA256 cái `payload` cùng headers. Nếu kết quả trùng khớp với chữ ký mà Svix gửi, nghĩa là request thật sự đến từ Clerk và dữ liệu không bị ai sửa đổi giữa đường.

### 2.3. Route Sự Kiện tương ứng (Event Switch-case)
```java
JsonNode event = objectMapper.readTree(payload);
String eventType = event.path("type").asText();
```
Parses cái `payload` thành JSON Node. Dữ liệu thực sự của User nằm trong phần tử `"data"`. Biến `eventType` sẽ xem loại sự kiện là gì:
- `"user.created"`, `"user.updated"`: Một người dùng mới được tạo hoặc cập nhật -> Chạy `handleUserUpsert()`.
- `"user.deleted"`: Người dùng bị xóa bên Clerk -> Chạy `handleUserDeleted()`.

---

## 3. Hàm Xóa & Cập Nhật (Upsert) Người Dùng: `handleUserUpsert`
```java
private void handleUserUpsert(String clerkUserId, JsonNode data) {
    User mapped = mapClerkDataToUser(data);
    mapped.setClerkId(clerkUserId);
    Optional<User> existingOpt = userRepository.findByClerkId(clerkUserId);
    // ...
```
Hàm này làm 2 nhiệm vụ: **Update (Cập nhật)** nếu user đã tồn tại, và **Insert (Thêm mới)** nếu user chưa tồn tại.

**Trường hợp User đã tồn tại (Update):**
- Chỉ ghi đè các trường thông tin cơ bản: FirstName, LastName, Phone, AvatarUrl,... lấy từ Clerk.
- **Lưu ý quan trọng**: Không ghi đè các quyền (Roles) hay cấu hình block (IsActive, IsBlocked). Vì những thông tin này được thao tác bởi Admin của hệ thống, không có ở bên Clerk, tránh việc đồng bộ vô tình xóa mất quyền admin của tài khoản nếu có cập nhật ảnh đại diện.

**Trường hợp User chưa tồn tại (Thêm mới):**
1. Set `createdAt` là hiện tại.
2. Lưu User mới này xuống Database của mình.
3. **Đặc biệt:** `clerkService.updatePublicMetadata(clerkUserId, "user");`
   Vì Clerk là nơi cấp JWT Token cho Frontend, mà hệ thống của bạn muốn dùng `role` để phân quyền. Dòng code này sẽ gọi ngược API của Clerk: _"Ê Clerk, gán thuộc tính role=user vào metadata công khai của account này giúp tao."_ Từ đó, mỗi lần Clerk cấp JWT, nó sẽ nhúng `"role": "user"` giúp backend phân quyền ở Resource Server sau này.

---

## 4. Hàm Chuyển Đổi Dữ Liệu Clerk -> User: `mapClerkDataToUser`
Hàm này biến cái cục JSON khổng lồ của Clerk thành object `User` dễ làm việc.
- **Email**: Lấy ra từ mảng `email_addresses`.
- **Tài khoản liên kết/Provider (Google, Facebook)**: Lấy từ mảng `external_accounts`. Khúc này rất hay: Nó nhận diện đăng nhập bằng Google/Facebook, và ưu tiên móc `avatar_url` độ phân giải cao của Google/Facebook thay vì ảnh mặc định của Clerk lấy được qua `image_url` chung chung.
- **Thiết lập mặc định cho mọi User mới**:
```java
user.setRoles(new ArrayList<>(List.of("USER")));
user.setIsActive(true);
user.setIsBlocked(false);
```

---

## 5. Thuật Toán Xác Minh Chữ Ký: `verifySignature`
Đây là bước bảo mật quan trọng nhất.
- Clerk/Svix băm (Hash) chuỗi bao gồm: `[svixId].[svixTimestamp].[payload]` bằng thuật toán bảo mật một chiều `HmacSHA256` kết hợp cùng **Signing Secret** của bạn (chuỗi bí mật cấp cho app khi tạo repo trên Clerk).
- `WebhookController` sau khi nhận `payload` cũng mang cái Secret đó tự thực hiện thao tác Hash y chang như vậy ở phía Server.
- Cuối cùng, so sánh 2 dải Hash: Hash mình tự tạo và Hash (`svixSignature`) gửi tới coi có khớp không. Nếu bằng nhau -> Bảo mật. Không bằng nhau -> Thằng nào đó giả mạo Clerk -> Từ chối.

## Tổng Kết
Toàn bộ file này giống như một "sứ giả dữ liệu" đảm bảo hai thế giới: **Clerk Dashboard (Auth)** và **MySQL System (Data)** của bạn luôn thống nhất với nhau một cách an toàn nhất có thể.
