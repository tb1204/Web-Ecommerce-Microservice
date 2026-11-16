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

