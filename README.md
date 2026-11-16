# 🛏️ ARTISANO — Hệ Thống Thương Mại Điện Tử Chăn Ga Gối Nệm

> **Nền tảng thương mại điện tử chuyên ngành chăn ga gối nệm hiệu năng cao xây dựng theo kiến trúc Microservices,
> tích hợp trợ lý ảo AI Chatbot (Google Dialogflow), cổng thanh toán VNPay, thông báo thời gian thực và quản lý đơn hàng hướng sự kiện.**

* **Backend:** Java 17 | Spring Boot 3.3.x | Spring Cloud 2023 (Eureka Server, API Gateway) 
* **Frontend:** React 19 | TypeScript | Vite 7 | Tailwind CSS | Redux Toolkit | Clerk Authentication
* **Database & Broker & Cache:** MongoDB 7.0 | RabbitMQ 3.13 | Redis 7
* **AI & Third-Party:** Google Dialogflow ES | VNPay Gateway | Cloudinary CDN | Gmail SMTP
* **DevOps & Testing:** Docker | Docker Compose | Nginx Alpine 

---

## I. Giới Thiệu Tổng Quan

**Artisano** là giải pháp phần mềm thương mại điện tử chuyên sâu phục vụ ngành hàng giấc ngủ & phòng ngủ cao cấp (nệm cao su, nệm lò xo, nệm foam, chăn ga, gối topper, phụ kiện), được thiết kế giải quyết triệt để các bài toán kỹ thuật phức tạp trong hệ thống phân tán:

* **Kiến trúc phân tán Microservices & Database-per-Service:** Chia tách toàn bộ hệ thống thành 9 microservices độc lập nghiệp vụ, đảm bảo khả năng cô lập lỗi, dễ dàng mở rộng và triển khai độc lập.
* **Trợ lý ảo AI Chatbot tư vấn thông minh (Dialogflow NLP & Webhook):** Tự động nhận diện ý định mua sắm (kích thước, độ dày, mức giá, tình trạng đau lưng), truy vấn dữ liệu theo thời gian thực từ `product-service` và phản hồi kèm liên kết sản phẩm trực tiếp.
* **Giao dịch thanh toán an toàn:** Tích hợp cổng thanh toán trực tuyến **VNPay Sandbox** với chữ ký bảo mật HMAC-SHA512 và cơ chế kiểm soát đơn hàng tự động hoàn kho khi quá hạn.
* **Giao tiếp bất đồng bộ & Thời gian thực (Event-Driven & WebSockets):** Sử dụng **RabbitMQ** để gửi email hóa đơn/thông báo không làm nghẽn luồng xử lý đơn hàng, kết hợp **WebSocket (STOMP + SockJS)** để cập nhật trạng thái đơn và tin nhắn chat tức thời.
* **Chống quá tải & Chịu lỗi:** Bảo vệ hệ thống qua **Redis Token Bucket Rate Limiting**.

---

## II. Kiến Trúc Hệ Thống & Luồng Hoạt Động (Architecture & Flow)

Hệ thống được thiết kế theo mô hình Microservices kết hợp Event-Driven Architecture, giao tiếp đồng bộ qua RESTful HTTP (qua Discovery Server) và bất đồng bộ qua RabbitMQ Message Broker.

<img width="1061" height="742" alt="ht111" src="https://github.com/user-attachments/assets/ae76a850-6edb-446b-8f00-04522952ec2b" />

### Chi Tiết Các Thành Phần Kiến Trúc

#### 1. Web Browser:
- Là nơi người dùng cuối truy cập website.
- Gửi yêu cầu đến Front-End (ReactJS) để hiển thị giao diện, xử lý thao tác và giao tiếp với Backend.

#### 2. Front-End (ReactJS):
- **UI, Components:** Xây dựng giao diện người dùng, quản lý state và hiển thị dữ liệu.
- **Gọi API trực tiếp:**
  - Gửi request đến API Gateway để lấy hoặc cập nhật dữ liệu từ backend.
  - Xử lý xác thực người dùng.
- **WebSocket:** Kết nối realtime tới ChatService để nhận tin nhắn và thông báo tức thời.
- **Kết nối dịch vụ ngoài:**
  - **Cloudinary:** Lưu trữ và quản lý hình ảnh/media.
  - **VNPay:** Xử lý thanh toán trực tuyến.
  - **Xác thực và quản lý phiên người dùng** (Clerk).

#### 3. API Gateway:
- Là cổng trung gian duy nhất tiếp nhận request từ Frontend.
- Thực hiện xác thực, phân quyền và định tuyến request đến các microservice phù hợp.
- Giao tiếp với Discovery Server để xác định vị trí service.

#### 4. Discovery Server (Eureka):
- Quản lý danh sách các microservice đang hoạt động.
- Cho phép các service đăng ký và tự động tìm kiếm lẫn nhau khi giao tiếp.

#### 5. Microservices:
Mỗi microservice đảm nhiệm một chức năng riêng và sử dụng cơ sở dữ liệu độc lập (Database-per-Service):
- **User Service:** Phụ trách quản lý thông tin tài khoản, xác thực và phân quyền người dùng.
- **Product Service:** Quản lý dữ liệu sản phẩm như nệm và các phụ kiện đi kèm.
- **Cart Service:** Xử lý các thao tác liên quan đến giỏ hàng của người dùng.
- **Order Service:** Chịu trách nhiệm xử lý và quản lý toàn bộ quy trình đơn hàng, từ khởi tạo đến khi hoàn tất giao dịch.
- **Payment Service:** Thực hiện xử lý thanh toán với các phương thức như VNPay hoặc COD.
- **Review Service:** Quản lý nội dung đánh giá và phản hồi từ khách hàng.
- **Chat Service:** Quản lý hội thoại, tin nhắn realtime.
- **Notification Service:** Phụ trách gửi và quản lý các thông báo đến người dùng.
- **Voucher Service:** Quản lý mã giảm giá, chương trình khuyến mãi và áp dụng vào đơn hàng.

## III. Công Nghệ Sử Dụng 

Hệ thống được xây dựng trên nền tảng các công nghệ hiện đại, phân tách rõ ràng theo từng tầng kiến trúc:

### 1. Backend & Microservices
* **Ngôn ngữ:** Java 17 (LTS)
* **Framework cốt lõi:** Spring Boot 3.3.x
* **Hệ sinh thái Cloud:** Spring Cloud 2023
  * **Eureka Server:** Quản lý đăng ký và phát hiện dịch vụ tập trung (Service Discovery & Registry).
  * **Spring Cloud Gateway (WebFlux):** Cổng API tập trung, định tuyến phản ứng (Reactive Routing), phân phối tải.
  * **Resilience4j:** Circuit Breaker ngắt mạch và phục hồi sự cố tự động (Fault Tolerance), Fallback endpoints.
  * **Redis Rate Limiter:** Kiểm soát tần suất request bảo vệ hệ thống dựa trên thuật toán Token Bucket.
* **Xác thực & Bảo mật:** Clerk JWT, Clerk Webhook Signature Verification .
* **Giao tiếp Realtime:** Spring WebSocket.
* **Lập lịch (Scheduling):** Spring `@Scheduled` dọn dẹp đơn hàng chưa thanh toán quá hạn.

### 2. Frontend Client
* **Thư viện chính:** React 19 (SPA)
* **Ngôn ngữ:** TypeScript 5.9
* **Công cụ đóng gói (Build Tool):** Vite 7
* **Quản lý trạng thái:** Redux Toolkit
* **Giao diện & Styling:** Tailwind CSS 3.4, Lucide Icons, React Icons, Swiper (Carousels/Sliders)
* **Xác thực người dùng:** Clerk React SDK (`@clerk/clerk-react`, hỗ trợ Google OAuth, Email OTP, Account Portal)
* **Kết nối & Đồ thị:** Axios Client (Interceptors đính kèm Clerk JWT), Recharts (Biểu đồ doanh thu/thống kê), React-to-Print (Xuất & in hóa đơn PDF), SweetAlert2, Sonner Toast.

### 3. Database, Cache & Message Broker
* **Cơ sở dữ liệu:** MongoDB 7.0 (NoSQL)
  * Mô hình linh hoạt cho danh mục chăn nệm đa biến thể (Variant, Size, Thickness, Firmness, Specifications).
  * Đánh chỉ mục **Full-Text Search (`@TextIndexed`)** phục vụ tìm kiếm nhanh chóng theo từ khóa sản phẩm.
* **Bộ nhớ đệm & Phân phối:** Redis 7 (In-Memory Key-Value) dùng làm Token Bucket cho API Gateway Rate Limiting.
* **Message Broker:** RabbitMQ 3.13 (AMQP Protocol)
  * Hàng đợi xử lý gửi email xác nhận đơn hàng, email hóa đơn và thông báo đẩy.
  * Đảm bảo tính nhất quán cuối cùng giữa các microservices.

### 4. Dịch vụ Đám Mây & Trí Tuệ Nhân Tạo (Cloud & AI)
* **Google Dialogflow ES:** Phân tích ý định (Intent), bóc tách thực thể (Entities: kích thước, độ cứng, ngân sách, chủng loại nệm).
* **VNPay Payment Gateway:** Cổng thanh toán quốc gia, tạo URL giao dịch an toàn với thuật toán mã hóa SHA-512.
* **Cloudinary CDN:** Lưu trữ và tối ưu hóa tài nguyên hình ảnh sản phẩm, ảnh/video feedback đánh giá và banner quảng cáo.
* **Google Gmail SMTP:** Hạ tầng gửi thư điện tử giao dịch tự động.

### 5. DevOps & Kiểm Thử
* **Container hóa:** Docker multi-stage build, Nginx Alpine làm Reverse Proxy phục vụ Frontend.
* **Điều phối dịch vụ:** Docker Compose với Healthchecks toàn diện giữa các container.

---

## IV. Tính Năng Chính & Điểm Nhấn Kỹ Thuật 

### 1. Nghiệp Vụ Khách Hàng 

* **Xác thực Đa Kênh An Toàn (Clerk Authentication):**
  * Đăng nhập 1-click qua tài khoản Google hoặc xác thực mã OTP qua Email.
  * Tự động đồng bộ hồ sơ người dùng về MongoDB thông qua Clerk Webhooks.
* **Tìm Kiếm & Khám Phá Sản Phẩm Phòng Ngủ Chuyên Biệt:**
  * Bộ lọc chuyên biệt cho ngành nệm: Kích thước, Độ dày, Độ cứng, Chất liệu.
  * Tìm kiếm tức thì với Full-text Search MongoDB.
* **Giỏ Hàng & Mua Sắm Linh Hoạt:**
  * Thêm/sửa/xóa biến thể sản phẩm, tự động kiểm tra số lượng tồn kho theo thời gian thực.
  * Áp dụng mã giảm giá (Voucher) theo giá trị đơn tối thiểu, mức giảm phần trăm hoặc số tiền cố định.
* **Chương Trình Khách Hàng Thân Thiết (Membership Tier):**
  * Tự động tích lũy chi tiêu sau mỗi đơn hàng giao dịch thành công.
  * Phân cấp thành viên tự động: **Silver (3%)**, **Gold (7%)**, **Diamond (12%)** giảm trừ trực tiếp trên hóa đơn checkout.
* **Thanh Toán Linh Hoạt & Đa Dạng:**
  * Thanh toán khi nhận hàng (COD).
  * Thanh toán trực tuyến qua cổng **VNPay** (Thẻ ATM nội địa, QR Pay, Thẻ quốc tế Visa/Mastercard).
* **Trợ Lý Ảo Chatbot AI & Live Support (Hybrid Chat):**
  * Tự động giải đáp thắc mắc 24/7 về chọn nệm, so sánh chất liệu, tra cứu đơn hàng, tư vấn ngân sách.
  * Trả lời kèm thẻ sản phẩm tương tác.
  * Khách hàng có thể yêu cầu chuyển đổi sang chế độ tư vấn trực tiếp với nhân viên quản trị (Admin).
* **Đánh Giá & Nhận Xét Chân Thực:**
  * Chỉ khách hàng đã mua sản phẩm mới được quyền gửi đánh giá sao, kèm hình ảnh hoặc video thực tế.

---

### 2. Nghiệp Vụ Quản Trị Viên

* **Bảng Điều Khiển Thống Kê:**
  * Biểu đồ doanh thu theo ngày/tháng với Recharts.
  * Thống kê tổng số lượng đơn hàng, sản phẩm bán chạy nhất, lượng khách hàng mới.
* **Quản Lý Sản Phẩm & Biến Thể Kho:**
  * Thêm/sửa sản phẩm, quản lý ma trận biến thể.
  * Quản lý trạng thái tồn kho, cảnh báo hết hàng, tải ảnh lên Cloudinary CDN.
* **Quản Lý Đơn Hàng & In Hóa Đơn:**
  * Theo dõi luồng trạng thái đơn: Chờ xử lý ➔ Đã xác nhận ➔ Đang giao ➔ Đã giao ➔ Đã hủy.
  * Tích hợp tính năng **In Hóa Đơn PDF (Print Invoice)** tiêu chuẩn trực tiếp từ trình duyệt.
* **Quản Lý Khuyến Mãi (Vouchers & Flash Sale):**
  * Thiết lập chiến dịch giảm giá, giới hạn lượt dùng toàn hệ thống và giới hạn theo từng khách hàng.
* **Trung Tâm Chăm Sóc Khách Hàng (Live Chat Support):**
  * Tiếp nhận các cuộc hội thoại từ khách hàng qua WebSocket, chuyển đổi trạng thái hỗ trợ Bot ➔ Nhân viên, gửi hình ảnh sản phẩm tư vấn tức thì.

---

### 3. Điểm Nhấn Kỹ Thuật

#### A. Kiến trúc AI Chatbot Webhook với Google Dialogflow & Spring Boot
* Khi người dùng hỏi *"Tôi muốn tìm nệm 1m6 giá dưới 10 triệu"*, tin nhắn được đẩy qua kết nối WebSocket STOMP đến `chat-service`.
* `chat-service` gọi Dialogflow API để phân tích NLP: bóc tách Intent (`search_product`) và trích xuất thực thể (`size: 160x200`, `price_max: 10000000`).
* Dialogflow kích hoạt ngược lại **Fulfillment Webhook** trên `chat-service`. Service này sử dụng `RestTemplate` (được Eureka Load Balanced) truy vấn nội bộ dữ liệu từ `product-service`.
* Dữ liệu trả về được đóng gói vào `MessageMetadata` chứa `productLinks` và gửi về Frontend qua WebSocket. Giao diện React lập tức sinh nút điều hướng "Xem ngay" mà không cần tải lại trang.

#### B. Kiểm Soát Tải & Chống Tấn Công với Redis Token Bucket Rate Limiting
* Tầng API Gateway áp dụng bộ lọc `RequestRateLimiter` tích hợp Redis:
  * Route nhạy cảm như Đặt hàng/Thanh toán: Giới hạn 5 - 25 req/s để ngăn ngừa spam và gian lận.
  * Route tra cứu sản phẩm: Cho phép tải cao 40 - 80 req/s.
* Áp dụng thuật toán **Token Bucket** theo địa chỉ IP của Client, giúp bảo vệ các service phía sau không bị quá tải khi có lượng truy cập đột biến.

#### C. Chống Sụp Đổ Hệ Thống Dây Chuyền
* Toàn bộ các route qua API Gateway được bọc bởi Resilience4j Circuit Breaker.
* Khi một microservice gặp sự cố (tỷ lệ lỗi vượt quá 50% trong sliding window 100 requests), Circuit Breaker tự động chuyển sang trạng thái **OPEN** trong 10 giây, ngay lập tức chuyển hướng sang `fallbackUri` trả về thông báo lỗi thân thiện thay vì để kết nối của người dùng bị treo vô tận.

#### D. Xử Lý Đơn Hàng Bất Đồng Bộ Hướng Sự Kiện (Event-Driven Architecture)
* Khi khách hàng đặt đơn hoặc thanh toán thành công, `order-service` / `payment-service` đẩy sự kiện `OrderCreatedEvent` hoặc `PaymentCompletedEvent` vào RabbitMQ Exchange.
* `notification-service` tiêu thụ message từ Queue để:
  1. Ghi nhận thông báo vào MongoDB.
  2. Bắn thông báo Realtime lên thanh chuông thông báo của Client qua WebSocket.
  3. Soạn email HTML xác nhận và gửi qua Gmail SMTP.
* Quá trình này hoàn toàn tách rời (decoupled), giúp thời gian phản hồi API checkout của khách hàng luôn dưới **100ms**.

#### E. Cơ Chế Quét Đơn Hàng Tự Động & Hoàn Trả Tồn Kho (Order Cleanup Task)
* Để phòng tránh tình trạng khách hàng giữ chỗ (giữ hàng tồn kho) nhưng không hoàn tất thanh toán VNPay, hệ thống triển khai Spring `@Scheduled` định kỳ chạy tác vụ dọn dẹp:
* Tự động quét và chuyển trạng thái các đơn hàng quá hạn thanh toán sang `CANCELLED`, đồng thời gửi tín hiệu hoàn trả lại số lượng tồn kho (restock quantity) cho từng biến thể của `product-service`.

#### F. Đồng Bộ Dữ Liệu An Toàn với Clerk Webhook
* Thay vì tự quản lý mật khẩu phức tạp, hệ thống ủy quyền xác thực cho Clerk.
* Khi người dùng tạo/sửa tài khoản trên Clerk, một Webhook Event có chữ ký mã hóa sẽ gửi về endpoint `/api/webhook/clerk`.
* `user-service` sử dụng khóa bí mật `CLERK_WEBHOOK_SIGNING_SECRET` để xác thực chữ ký (thông qua `Svix Webhook`), đảm bảo tuyệt đối không có request giả mạo nào có thể thay đổi dữ liệu người dùng.

---

## V. Cấu Trúc Thư Mục Dự Án (Project Structure)

Dự án được phân chia module khoa học và độc lập hoàn toàn giữa Backend, Frontend, Dữ liệu khởi tạo và Kiểm thử:

```plaintext
Web-Ecommerce-Microservice/
├── backend/                               # Toàn bộ mã nguồn các Microservices
│   ├── apigateway/                        # Spring Cloud Gateway, Redis Rate Limiter, Circuit Breaker (Port: 8080)
│   ├── discoveryserver/                   # Eureka Discovery Server quản lý Service Registry (Port: 8761)
│   ├── userservice/                       # Quản lý tài khoản, Clerk Webhook, Wishlist, Hạng thành viên (Port: 8081)
│   ├── productservice/                    # Quản lý danh mục, biến thể chăn nệm, tồn kho, Full-text Search (Port: 8082)
│   ├── cartservice/                       # Giỏ hàng, kiểm tra đồng bộ giá & tồn kho (Port: 8083)
│   ├── order-service/                     # Quản lý đơn hàng, Cleanup task đơn quá hạn, Doanh thu (Port: 8084)
│   ├── paymentservice/                    # Tích hợp VNPay Gateway HMAC-SHA512, thanh toán COD (Port: 8085)
│   ├── chatservice/                       # WebSocket STOMP, Google Dialogflow NLP & Webhook gợi ý sản phẩm (Port: 8086)
│   ├── notificationservice/               # Lắng nghe RabbitMQ, gửi email Gmail SMTP & WebSocket thông báo (Port: 8087)
│   ├── review-service/                    # Đánh giá sao, đính kèm ảnh/video Cloudinary, phản hồi admin (Port: 8088)
│   ├── voucherservice/                    # Quản lý khuyến mãi, mã giảm giá, kiểm tra điều kiện áp dụng (Port: 8089)
│
├── frontend/                              # Ứng dụng Web Single Page Application (SPA)
│   ├── public/                            # Tài nguyên tĩnh, favicon, assets thương hiệu Artisano
│   ├── src/
│   │   ├── api/                           # Cấu hình Axios Client & Interceptor tự động gắn Bearer Token
│   │   ├── components/
│   │   │   ├── Admin/                     # Các trang & modal quản trị (Sản phẩm, Voucher, Đơn hàng, Chat, Doanh thu)
│   │   │   ├── Cart/                      # Nội dung giỏ hàng, cập nhật biến thể
│   │   │   ├── common/                    # Header, Footer, MegaMenu, Banner, Breadcrumb, ProtectedRoute
│   │   │   ├── layouts/                   # Layout người dùng, Navbar, CartDrawer, ChatWidget nổi
│   │   │   └── Products/                  # Card sản phẩm, Grid, Chi tiết sản phẩm, Reviews, Đồ họa thông số
│   │   ├── pages/                         # Các trang chính (Home, Checkout, MyOrders, Userchat, Policy, FlashSale...)
│   │   ├── store/                         # Quản lý State toàn cục ứng dụng với Redux Toolkit
│   │   ├── types/                         # Định nghĩa kiểu dữ liệu TypeScript (Product, Cart, Order, User...)
│   │   ├── App.tsx                        # Quản lý định tuyến và phân quyền truy cập (Role-based Routing)
│   │   └── main.tsx                       # Điểm khởi động React 19 Client
│   └── Dockerfile                         # Đóng gói Multi-stage build với Nginx Alpine
│
├── json/                                  # Dữ liệu mẫu (Seed Data) chuẩn bị sẵn cho MongoDB
├── docker-compose.yml                     # Tệp điều phối khởi chạy đồng loạt toàn bộ các container
└── README.md                              # Tài liệu hướng dẫn dự án
```

---

## VI. Hướng Dẫn Cài Đặt & Chạy Dự Án 

### 1. Yêu cầu môi trường (Prerequisites)
Đảm bảo máy tính của bạn đã chuẩn bị sẵn các công cụ sau:
* [Git](https://git-scm.com/) (để clone mã nguồn)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (hỗ trợ Docker Compose v2)
* [Node.js 20+](https://nodejs.org/) & [Java 17 JDK](https://adoptium.net/) (nếu muốn chạy thử cục bộ từng service không qua Docker)
* [MongoDB 7.0](https://www.mongodb.com/try/download/community) (hoặc MongoDB Compass) chạy tại cổng mặc định `27017`

---

### 2. Các bước triển khai chi tiết

#### Bước 2.1: Clone mã nguồn về máy
```bash
git clone https://github.com/tb1204/Web-Ecommerce-Microservice.git
cd Web-Ecommerce-Microservice
```

#### Bước 2.2: Khởi tạo Cơ Sở Dữ Liệu & Nạp Dữ Liệu Mẫu (Seed Data)
Toàn bộ dữ liệu mẫu về danh mục sản phẩm, biến thể chăn nệm, tài khoản và voucher đã được chuẩn bị sẵn trong thư mục `json/`.

Bạn có thể nhập nhanh vào MongoDB cục bộ bằng công cụ `mongoimport`:

* **Trên Windows PowerShell:**
```powershell
mongoimport --uri "mongodb://localhost:27017/artisano" --collection categories --file json/artisano.categories.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/artisano" --collection products --file json/artisano.products.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/artisano" --collection users --file json/artisano.users.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/artisano" --collection vouchers --file json/artisano.vouchers.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/artisano" --collection reviews --file json/artisano.reviews.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/artisano" --collection orders --file json/artisano.orders.json --jsonArray
```

* **Trên Linux / macOS (Terminal):**
```bash
mongoimport --uri "mongodb://localhost:27017/artisano" --collection categories --file json/artisano.categories.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/artisano" --collection products --file json/artisano.products.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/artisano" --collection users --file json/artisano.users.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/artisano" --collection vouchers --file json/artisano.vouchers.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/artisano" --collection reviews --file json/artisano.reviews.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/artisano" --collection orders --file json/artisano.orders.json --jsonArray
```
*(Lưu ý: Dịch vụ chat-service sẽ tự động tạo database `message` khi có hội thoại mới).*

#### Bước 2.3: Khởi chạy toàn bộ hệ thống bằng Docker Compose
Dự án đã được cấu hình sẵn toàn bộ biến môi trường (Clerk, Cloudinary, RabbitMQ, VNPay Sandbox) trong `docker-compose.yml`. Bạn chỉ cần thực hiện 1 câu lệnh duy nhất:

```bash
docker compose up -d --build
```

Kiểm tra trạng thái các container:
```bash
docker compose ps
```
Khi các container dịch vụ (`frontend`, `api-gateway`, `eureka-server`, `user-service`, `product-service`, `cart-service`, `order-service`, `payment-service`, `chat-service`, `notification-service`, `review-service`, `voucher-service`, `rabbitmq`, `redis`) đều ở trạng thái `running` (hoặc `Up`), hệ thống đã sẵn sàng phục vụ!

---

### 3. Danh Sách Đường Dẫn Truy Cập Dịch Vụ

| Dịch vụ | Địa chỉ truy cập (URL) | Cổng | Mô tả chi tiết |
| :--- | :--- | :---: | :--- |
| **Giao diện Web Artisano** | [http://localhost:5173](http://localhost:5173) | `5173` | Giao diện khách hàng & Cổng quản trị Admin Portal |
| **API Gateway** | [http://localhost:8080](http://localhost:8080) | `8080` | Điểm tiếp nhận API tập trung, Rate Limiter & Circuit Breaker |
| **Eureka Server Dashboard** | [http://localhost:8761](http://localhost:8761) | `8761` | Bảng điều khiển theo dõi các Microservices |
| **RabbitMQ Management** | [http://localhost:15672](http://localhost:15672) | `15672` | Quản lý hàng đợi tin nhắn (Tài khoản: `guest` / `guest`) |
| **Redis Cache** | `localhost:6379` | `6379` | Cung cấp Token Bucket cho Rate Limiter |

---

## VII. Một Số Giao Diện 

<img width="1386" height="670" alt="Picture1" src="https://github.com/user-attachments/assets/ddff36c0-7a3c-4712-9ee8-6a44fc72a444" />
<img width="1295" height="890" alt="Picture2" src="https://github.com/user-attachments/assets/22477c9d-c2a9-49d3-b7c1-5b6a88bba1d2" />
<img width="1238" height="846" alt="Picture3" src="https://github.com/user-attachments/assets/57ad237c-b258-4573-a1ac-0cfed2b34c04" />
<img width="771" height="867" alt="Picture4" src="https://github.com/user-attachments/assets/c1803bad-a594-4ee7-a1b7-6614a2b713d5" />
<img width="1136" height="562" alt="Picture5" src="https://github.com/user-attachments/assets/29415cad-8f21-4482-88ae-42e11cc4c1bc" />
<img width="1446" height="759" alt="Picture6" src="https://github.com/user-attachments/assets/d764c5c4-93ec-46ac-a093-f3c5b577d407" />
<img width="944" height="885" alt="Picture7" src="https://github.com/user-attachments/assets/ab213078-57cf-4032-adca-6f6a1eabfcf5" />

---
## VIII. Hướng Phát Triển Trong Tương Lai 

1. **Khuyến nghị sản phẩm bằng học máy (Machine Learning Recommendation System):**
   * Xây dựng mô hình Collaborative Filtering hoặc Content-Based Filtering dựa trên lịch sử xem hàng và độ cứng nệm yêu thích để đề xuất sản phẩm tối ưu.
2. **Quan sát & Truy vết phân tán (Distributed Tracing & Observability):**
   * Tích hợp **Prometheus** và **Grafana** để giám sát tài nguyên (CPU, Ram, JVM, HTTP status).
   * Triển khai **OpenTelemetry / Zipkin** để truy vết luồng request (Trace ID) xuyên suốt từ Gateway đến các dịch vụ sâu bên trong.
3. **Mô hình Saga điều phối giao dịch (Orchestrated Saga Pattern):**
   * Sử dụng Axon Framework hoặc Temporal để quản lý các giao dịch phân tán phức tạp khi thanh toán thất bại, tự động bù trừ dữ liệu (Compensating Transactions) giữa `order-service`, `payment-service` và `product-service`.
4. **Mở rộng kênh thanh toán quốc tế:**
   * Tích hợp thêm Stripe hoặc Apple Pay / Google Pay phục vụ người dùng quốc tế.

---

## Thông Tin Tác Giả 

* **Đề tài:** Xây Dựng Hệ Thống Thương Mại Điện Tử Phục Vụ Ngành Hàng Chăn Ga Gối Nệm Dựa Trên Kiến Trúc Microservices
* **Thực hiện:**
  * **Trần Công Bằng** ([@tb1204](https://github.com/tb1204))
  * **Lưu Thanh Dương** 
* **Mã nguồn dự án:** [https://github.com/tb1204/Web-Ecommerce-Microservice](https://github.com/tb1204/Web-Ecommerce-Microservice)







