# Hướng Dẫn Kịch Bản Trò Chuyện Của Chatbot (FAQ & DB)

Dưới đây là cẩm nang chi tiết nhất về các đoạn hội thoại diễn ra giữa Khách hàng và Chatbot Nệm & Chăn Ga của bạn. Kịch bản bao gồm các câu trả lời tĩnh (thiết lập trên Dialogflow) và các câu trả lời động (tự động móc nối vào Database thông qua Spring Boot).

---

## 🟢 NHÓM 1: TÍNH NĂNG ĐỘNG (LẤY DỮ LIỆU TỪ DATABASE)

Nhóm này sử dụng Webhook để lấy số liệu thực tế đang có trong CSDL của bạn (Qua *Order-Service*, *Product-Service* và *Voucher-Service*).

### 1. Ý định Tìm kiếm Sản Phẩm (`search_product`)
*   **Khi khách hàng hỏi:**
    *   *"Tìm cho tôi đệm cao su Kymdan"*
    *   *"Shop có bán nệm lò xo không?"*
    *   *"Mình muốn xem các loại gối"*
*   **Dữ liệu trích xuất (Entity):** Nhận diện thương hiệu (`brand`), loại nệm (`mattress_type`).
*   **Bot gọi DB & Trả lời:** *(Duyệt kho 4 sản phẩm đầu tiên phù hợp)*
    > Minh tìm thấy 3 sản phẩm phù hợp:
    > - Nệm cao su thiên nhiên Kymdan Deluxe (Giá: 15,000,000đ)
    > - Nệm cao su Massage Kymdan (Giá: 18,200,000đ)
    > - Nệm Foam Nhật Bản (Giá: 5,600,000đ)

### 2. Ý định Truy vấn Đơn Hàng (`check_order`)
*   **Khi khách hàng hỏi:**
    *   *"Tình trạng đơn hàng ORD20260411064032 tới đâu rồi?"*
    *   *"Kiểm tra giúp mã đơn ORD1234"*
*   **Dữ liệu trích xuất (Entity):** Thu thập đúng chuỗi mã đơn bắt đầu bằng chữ ORD.
*   **Bot gọi DB & Trả lời:**
    > *(Nếu có đơn hàng)* "Đơn hàng ORD20260411064032 của bạn hiện đang ở trạng thái: **Đã giao thành công**."
    > 
    > *(Nếu mã đơn sai/chưa nhập đúng)* "Bạn vui lòng cung cấp đúng mã đơn hàng bắt đầu bằng chữ ORD. Ví dụ: ORD2026..."
    > 
    > *(Nếu không tìm thấy)* "Tôi không tìm thấy đơn hàng mã ORD9999 trong hệ thống. Bạn vui lòng kiểm tra lại mã nhé!"

### 3. Ý định Hỏi Mã Giảm Giá (`check_promotion`)
*   **Khi khách hàng hỏi:**
    *   *"Cửa hàng đang có voucher nào không?"*
    *   *"Lấy mã freeship ở đâu?"*
    *   *"Chương trình khuyến mãi tháng này"*
*   **Bot gọi DB & Trả lời:** *(Quét bảng Vouchers đang có trạng thái Active)*
    > Hiện tại cửa hàng có các khuyến mãi sau:
    > - Mã **FREESHIP**: Miễn phí giao hàng toàn quốc
    > - Mã **SPRING2026**: Giảm 10% mừng đại lễ
    > - Mã **DIAMOND12**: Giảm 12% dành cho thành viên Kim Cương

---

## 🔵 NHÓM 2: TÍNH NĂNG TĨNH (TRẢ LỜI MẶC ĐỊNH THEO DIALOGFLOW)

Nhóm này không cần truy xuất Database. Nội dung trả lời được cấu hình sẵn trong website Dialogflow Console.

### 4. Bắt đầu trò chuyện (`welcome`)
*   **Khi khách hàng hỏi:** *"Hi"*, *"Hello"*, *"Chào shop"*, *"Alo"*
*   **Bot trả lời:**
    > "Xin chào! Tôi là Trợ lý AI của Cửa hàng Nệm & Chăn Ga. Tôi có thể giúp bạn tìm hiểu chi tiết sản phẩm, tư vấn chọn nệm theo tình trạng sức khỏe, hoặc giải quyết vấn đề về đơn hàng nhé!"

### 5. Ý định Hỏi Chi Tiết Sản Phẩm (`product_detail`)
*   **Khi khách hàng hỏi:** *"Đệm này có kích thước 1m8 x 2m không?"*
*   **Bot trả lời:** *(Câu dự phòng từ DB Webhook)*
    > "Bạn đang hỏi về kích thước: 1m8. Rất tiếc hiện tại tính năng lọc riêng từng size thông qua Bot đang được bảo trì. Bạn chát với Admin nhé!"

### 6. Ý định Hủy / Trả Hàng (`cancel_or_return`)
*   **Khi khách hàng hỏi:** *"Cách hủy đơn thế nào?"*, *"Tôi muốn trả hàng"*
*   **Bot mặc định trả lời:** (Phụ thuộc vào bạn cấu hình trong Dialogflow)
    > "Cửa hàng hỗ trợ đổi trả miễn phí trong vòng 7 ngày nếu lỗi từ nhà sản xuất. Bạn vui lòng chuẩn bị ảnh chụp sản phẩm và nhấn nút 'Chat với Admin' ở bên dưới để nhân viên hoàn trả tiền cho hệ thống nhé."

### 7. Ý định Hình Thức Thanh Toán (`payment_info`)
*   **Khi khách hàng hỏi:** *"Bên mình có thanh toán VNPay không?"*, *"Trả góp được không?"*
*   **Bot mặc định trả lời:**
    > "Chúng mình đang hỗ trợ 2 hình thức thanh toán chính: 1. Thanh toán tiền mặt khi nhận hàng (COD). 2. Thanh toán trực tuyến an toàn qua cổng VNPAY. Mọi giao dịch điện tử đều được bảo vệ!"

### 8. Ý định Thông Tin Vận Chuyển (`delivery_info`)
*   **Khi khách hàng hỏi:** *"Giao xuống Vũng Tàu bao lâu?"*, *"Phí ship tính thế nào?"*
*   **Bot mặc định trả lời:**
    > "Thời gian giao nệm thông thường từ 2 - 4 ngày tùy khu vực. Riêng các đơn hàng có giá trị trên 3.000.000đ sẽ được hoàn toàn MIỄN PHÍ VẬN CHUYỂN Toàn Quốc!"

### 🔴 9. Dự Phòng Lỗi & Không Hiểu Ý Khách (`fallback`)
*   **Khi khách hàng gõ loạn xạ:** *"sadasdas"*, *"hihohoho"* hoặc dùng các từ lóng AI chưa được học.
*   **Bot trả lời (Đảo ngẫu nhiên):**
    > - "Xin lỗi, tôi không hiểu. Bạn có thể nói rõ hơn được không?"
    > - "Tôi là Trợ lý Ảo nên chưa hiểu chính xác ý bạn, bạn vui lòng chọn Chat Với Admin để được tư vấn chính xác nhé."
