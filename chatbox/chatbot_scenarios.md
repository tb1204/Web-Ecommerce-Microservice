# 🤖 Kịch Bản Hội Thoại Chatbot — Nệm & Chăn Ga Artisano

> **Agent:** `mattress-agent` · Ngôn ngữ: `Tiếng Việt` · Nền tảng: Dialogflow ES  
> **Webhook:** `chat-service` (Spring Boot) → tích hợp `product-service`, `voucher-service`, `order-service`

---

## 🛠️ Hướng Dẫn Build Lại Service

### Service cần rebuild sau các thay đổi này

| Service | Lý do cần build lại | Lệnh |
|---------|---------------------|------|
| **`chat-service`** | Đã thay đổi: `DialogflowWebhookController`, `DialogflowService`, `MessageService`, `MessageMetadata`, `ChatWebSocketHandler`, `DialogflowResponse` | `mvn clean package -DskipTests` |
| **`frontend`** | Đã thay đổi: `UserchatPage.tsx` (thêm render nút "Xem ngay") | `npm run build` hoặc dev server tự reload |
| **Dialogflow Agent** | Đã thay đổi: toàn bộ intents + entities | Import ZIP lên Dialogflow Console |

> **Không cần build lại:** `product-service`, `voucher-service`, `order-service`, `api-gateway`

### Các bước thực hiện

```bash
# 1. Build chat-service
cd d:\luanvanhk2dvb\backend\chatservice
mvn clean package -DskipTests
# Sau đó restart container/process chat-service

# 2. Import lại Dialogflow Agent
# File ZIP: d:\luanvanhk2dvb\chatbox\mattress-agent-fixed.zip
# Vào: https://dialogflow.cloud.google.com/
# Chọn agent → Settings → Export and Import → IMPORT FROM ZIP

# 3. Frontend (nếu dùng dev server thì đã tự reload)
cd d:\luanvanhk2dvb\frontend
npm run dev
```

---

## 💬 Kịch Bản Hội Thoại Đầy Đủ

---

### 🟢 NHÓM 1 — CÂU TRẢ LỜI TĨNH (Dialogflow tự trả, không cần Webhook)

---

#### 1. Chào Hỏi — `welcome`

| | Nội dung |
|--|---------|
| 👤 **User hỏi** | "Hi", "Hello", "Chào shop", "Alo", "Xin chào" |
| 🤖 **Bot trả lời** | Xin chào! Tôi là Trợ lý AI của Cửa hàng Nệm & Chăn Ga. Tôi có thể giúp bạn tìm hiểu chi tiết sản phẩm, tư vấn chọn nệm theo tình trạng sức khỏe, hoặc giải quyết vấn đề về đơn hàng nhé! |
| ⚙️ **Loại** | Tĩnh — không dùng Webhook |

---

#### 2. Hình Thức Thanh Toán — `payment_info`

| | Nội dung |
|--|---------|
| 👤 **User hỏi** | "Bên mình có thanh toán VNPay không?" |
| | "Shop có hỗ trợ VNPay không?" |
| | "Mình thanh toán online được không?" |
| | "Shop có những hình thức thanh toán nào?" |
| | "Trả góp được không?" |
| | "Chấp nhận thẻ tín dụng không?" |
| | "Có thanh toán COD không?" |
| 🤖 **Bot trả lời** | Chúng mình đang hỗ trợ 2 hình thức thanh toán chính: 1. Thanh toán tiền mặt khi nhận hàng (COD). 2. Thanh toán trực tuyến an toàn qua cổng VNPAY. Mọi giao dịch điện tử đều được bảo vệ! |
| ⚙️ **Loại** | Tĩnh — không dùng Webhook |

---

#### 3. Thông Tin Vận Chuyển — `delivery_info`

| | Nội dung |
|--|---------|
| 👤 **User hỏi** | "Giao xuống Vũng Tàu bao lâu?" |
| | "Phí ship tính thế nào?" |
| | "Miễn phí vận chuyển không?" |
| | "Giao hàng tận nơi không?" |
| 🤖 **Bot trả lời** | Chúng tôi có chính sách giao nệm tận phòng phí thấp (thậm chí Freeship) tại nhiều khu vực. |
| ⚙️ **Loại** | Tĩnh — không dùng Webhook |

---

#### 4. Hủy / Đổi Trả — `cancel_or_return`

| | Nội dung |
|--|---------|
| 👤 **User hỏi** | "Cách hủy đơn thế nào?" |
| | "Tôi muốn trả hàng" |
| | "Chính sách đổi trả như thế nào?" |
| | "Nệm bị lỗi thì làm sao?" |
| 🤖 **Bot trả lời** | Chính sách đổi trả lên đến 100 ngày nếu lún xẹp. Bạn vui lòng chuẩn bị ảnh chụp sản phẩm và nhấn nút "Chat với Admin" để nhân viên hỗ trợ nhé. |
| ⚙️ **Loại** | Tĩnh — không dùng Webhook |

---

#### 5. So Sánh Sản Phẩm — `compare_product`

| | Nội dung |
|--|---------|
| 👤 **User hỏi** | "Nệm cao su và nệm lò xo khác nhau thế nào?" |
| | "Nệm foam hay nệm lò xo tốt hơn?" |
| | "So sánh nệm Kymdan và Liên Á" |
| 🤖 **Bot trả lời** | Chào bạn, sự khác biệt chính giữa các dòng sản phẩm này là cấu tạo và giá cả. Bảng so sánh cụ thể: (gợi ý chat với Admin để tư vấn chi tiết) |
| ⚙️ **Loại** | Tĩnh — không dùng Webhook |

---

### 🔵 NHÓM 2 — CÂU TRẢ LỜI ĐỘNG (Webhook → lấy dữ liệu từ Database)

---

#### 6. Tìm Kiếm Sản Phẩm — `search_product`

> Webhook gọi: `product-service/api/products/search?q={keyword}`  
> Entity trích xuất: `brand`, `mattress_type`, `product_type`  
> Fallback: nếu entity rỗng thì tự extract keyword từ câu gốc (bỏ stop-words "tôi, mình, shop...")

| | Nội dung |
|--|---------|
| 👤 **User hỏi** | "Shop có bán nệm lò xo không?" |
| | "Tìm cho tôi đệm cao su Kymdan" |
| | "Cho mình xem nệm cao su Kymdan" |
| | "Tìm nệm hãng Gummi" |
| | "Có nệm foam không?" |
| 🤖 **Bot trả lời (có kết quả)** | Mình tìm thấy **3** sản phẩm phù hợp: |
| | - Nệm cao su thiên nhiên Kymdan Deluxe (Giá từ: 15,000,000đ) [Xem ngay] |
| | - Nệm cao su Massage Kymdan (Giá từ: 18,200,000đ) [Xem ngay] |
| | - Nệm Foam Nhật Bản (Giá từ: 5,600,000đ) [Xem ngay] |
| 🤖 **Bot trả lời (không có)** | Rất tiếc, mình không tìm thấy sản phẩm nào khớp với "...". Bạn thử xem qua các gợi ý trên trang web nhé. |
| 🤖 **Bot trả lời (query rỗng)** | Bạn muốn tìm sản phẩm gì? Bạn hãy cho mình biết tên hoặc thương hiệu nhé. |
| ⚙️ **Loại** | Động — Webhook · Trả về nút "Xem ngay" cho từng sản phẩm |

---

#### 7. Tìm Theo Kích Thước — `product_detail`

> Webhook gọi: `product-service/api/products/all` rồi lọc theo `variant.size`  
> 5 size chuẩn trong DB: `120 x 200`, `140 x 200`, `160 x 200`, `180 x 200`, `220 x 200`

**Bảng nhận diện kích thước:**

| Cách user viết | Kết quả match |
|---------------|--------------|
| 1m2 x 2m, 1m2, 1.2m, 120x200 | 120 x 200 |
| 1m4 x 2m, 1m4, 1.4m, 140x200 | 140 x 200 |
| 1m6 x 2m, 1m6, 1.6m, 160x200 | 160 x 200 |
| 1m8 x 2m, 1m8, 1.8m, đôi, 180x200 | 180 x 200 |
| 2m2 x 2m, 2m2, king size, 220x200 | 220 x 200 |

| | Nội dung |
|--|---------|
| 👤 **User hỏi** | "Đệm này có kích thước 1m8 x 2m không?" |
| | "Shop có nệm 1m6 x 2m không?" |
| | "Có size 2m2 không?" |
| | "Tìm nệm size 1m2" |
| | "Nệm có size nào?" |
| 🤖 **Bot trả lời (có kết quả)** | Mình tìm thấy **10** sản phẩm có kích thước **1m8 x 2m (180 x 200)**: |
| | - Nệm bông ép Wonjun Pure Carbon dày 10cm (Giá từ: 3,299,000đ) [Xem ngay] |
| | - Nệm bông ép Goodnight Nova gấp 3 9cm (Giá từ: 2,499,000đ) [Xem ngay] |
| | - Nệm cao su Gummi Premium detox (Giá từ: 12,499,000đ) [Xem ngay] |
| | ... và 7 sản phẩm khác trên website! |
| 🤖 **Bot trả lời (không có)** | Rất tiếc, mình không tìm thấy sản phẩm nào có kích thước 1m4 x 2m (140 x 200). Shop đang có các size: 1m2, 1m4, 1m6, 1m8 và 2m2. |
| ⚙️ **Loại** | Động — Webhook · Trả về nút "Xem ngay" cho từng sản phẩm |

---

#### 8. Hỏi Mã Giảm Giá / Voucher — `check_promotion`

> Webhook gọi: `voucher-service/api/vouchers`

| | Nội dung |
|--|---------|
| 👤 **User hỏi** | "Cửa hàng đang có voucher nào không?" |
| | "Lấy mã freeship ở đâu?" |
| | "Chương trình khuyến mãi tháng này" |
| | "Có mã giảm giá không?" |
| 🤖 **Bot trả lời** | Hiện tại cửa hàng có các khuyến mãi sau: |
| | - Mã **LTD**: Giảm giá sản phẩm 20,000đ |
| | - Mã **FREE**: Miễn phí vận chuyển (Tối đa 30,000đ) |
| 🤖 **Bot trả lời (không có)** | Hiện tại cửa hàng không có mã giảm giá nào kích hoạt. |
| ⚙️ **Loại** | Động — Webhook |

---

#### 9. Tra Cứu Đơn Hàng — `check_order`

> Webhook gọi: `order-service/api/orders/number/{orderId}`  
> Entity trích xuất: `order_id` — nhận diện mã bắt đầu bằng `ORD`

| | Nội dung |
|--|---------|
| 👤 **User hỏi** | "Tình trạng đơn hàng ORD20260411064032 tới đâu rồi?" |
| | "Kiểm tra giúp mã ORD2026..." |
| 🤖 **Bot trả lời (tìm thấy)** | Đơn hàng **ORD20260411064032** của bạn hiện đang ở trạng thái: **Đã giao thành công**. |
| 🤖 **Bot trả lời (không tìm thấy)** | Tôi không tìm thấy đơn hàng mã **ORD9999** trong hệ thống. Bạn vui lòng kiểm tra lại mã nhé! |
| 🤖 **Bot trả lời (mã sai format)** | Bạn vui lòng cung cấp đúng mã đơn hàng bắt đầu bằng chữ **ORD**. Ví dụ: ORD20260411064032. |
| ⚙️ **Loại** | Động — Webhook |

**Các trạng thái đơn hàng bot hiển thị:**

| Trạng thái DB | Bot hiển thị |
|---|---|
| PENDING | Đang chờ xử lý |
| PROCESSING | Đang xử lý / đóng gói |
| SHIPPING | Đang giao hàng |
| DELIVERED | Đã giao thành công |
| CANCELLED | Đã hủy |

---

### 🔴 NHÓM 3 — FALLBACK

---

#### 10. Không Nhận Diện Được — `fallback`

| | Nội dung |
|--|---------|
| 👤 **User gõ** | "sadasdas", "hihohoho", các từ lóng / câu không liên quan |
| 🤖 **Bot trả lời** | Xin lỗi, tôi chưa hiểu rõ ý của bạn. Bạn có thể nói rõ hơn về việc muốn tìm nệm, chăn ga, hay kiểm tra đơn hàng không ạ? |
| ⚙️ **Hành vi đặc biệt** | Bot fallback → tự động chuyển sang Admin (handoff) |

---

## 📋 Bảng Tổng Hợp Intent

| Intent | Loại | Webhook | Entity trích xuất | Handoff Admin |
|--------|------|---------|------------------|--------------|
| `welcome` | Tĩnh | Không | — | Không |
| `payment_info` | Tĩnh | Không | — | Không |
| `delivery_info` | Tĩnh | Không | — | Không |
| `cancel_or_return` | Tĩnh | Không | — | Không |
| `compare_product` | Tĩnh | Không | mattress_type, brand, price_range | Không |
| `search_product` | Động | Có (product-service) | brand, mattress_type, product_type | Không |
| `product_detail` | Động | Có (product-service) | mattress_type, brand, size | Không |
| `check_promotion` | Động | Có (voucher-service) | promotion_type, brand | Không |
| `check_order` | Động | Có (order-service) | order_id | Không |
| `fallback` | Tĩnh | Không | — | Có (tự động) |

---

## 🏷️ Danh Sách Entity (Từ điển Dialogflow)

### Thương Hiệu (@brand)
Kymdan · Liên Á · Vạn Thành · Kim Cương · Gummi · Wonjun · Goodnight · Aeroflow

### Loại Nệm (@mattress_type)
Nệm cao su · Nệm lò xo · Nệm bông ép · Nệm Foam

### Kích Thước (@size) — 5 size chuẩn

| Giá trị | Synonyms tiêu biểu |
|---------|-------------------|
| 120x200 | 1m2, 1m2 x 2m, 1.2m, 120x200cm |
| 140x200 | 1m4, 1m4 x 2m, 1.4m, 140x200cm |
| 160x200 | 1m6, 1m6 x 2m, 1.6m, 160x200cm |
| 180x200 | 1m8, 1m8 x 2m, 1.8m, đôi, 180x200cm |
| 220x200 | 2m2, 2m2 x 2m, king size, 220x200cm |

### Các Entity Khác
- **@product_type**: nệm, chăn ga, gối, tấm trải...
- **@price_range**: dưới 5 triệu, 5-10 triệu, trên 10 triệu...
- **@firmness**: mềm, vừa, cứng, trung bình...
- **@material**: cao su, lò xo, memory foam...
- **@order_id**: mã ORD + số (VD: ORD20260411064032)
- **@promotion_type**: voucher, mã giảm giá, freeship...
