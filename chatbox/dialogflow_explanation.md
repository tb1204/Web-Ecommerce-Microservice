# Hướng Dẫn Hiểu Về Chatbot Đệm (Dialogflow)

Dựa vào cấu trúc thư mục của **Mattress Agent**, dưới đây là giải thích chi tiết về cách Chatbot của bạn "tư duy" và trả lời khách hàng.

---

## 1. Sự khác biệt giữa INTENT và ENTITY

Để hiểu Bot trả lời như thế nào, bạn cần phân biệt được 2 khái niệm cốt lõi này trong Dialogflow:

### 🧩 INTENT (Ý định của người dùng)
- **Định nghĩa:** Là **Mục tiêu chính** mà khách hàng muốn khi nhắn tin. 
- **Cách hoạt động:** Khi người dùng nói một câu, Dialogflow sẽ quét câu đó và khớp nó vào **1 Intent duy nhất**.
- **Ví dụ:** Dù khách nhắn *"Alo"*, *"Chào shop"*, hay *"Hello"* thì tất cả đều quy chung về một Intent là **`welcome`** (Chào hỏi). Dù nhắn *"Đơn của tôi đâu?"* hay *"Kiểm tra đơn hàng"* thì đều đưa vào Intent **`check_order`**.

### 🏷️ ENTITY (Thực thể / Từ khóa chi tiết)
- **Định nghĩa:** Là các **Thông số / Danh từ chỉ định** nằm bên trong câu nói của khách. Nó báo cho Bot biết những chi tiết cụ thể để thực hiện Intent.
- **Cách hoạt động:** Được trích xuất từ câu nói của người dùng sau khi đã xác định được Intent.
- **Ví dụ:** Khách nói *"Tôi muốn tìm nệm cao su Kymdan giá rẻ"*. 
  - **Intent** bắt được: `search_product` (Tìm kiếm sản phẩm).
  - **Entities** móc ra được: 
    - `mattress_type`: Nệm cao su
    - `brand`: Kymdan
    - `price_range`: giá rẻ

> **💡 TÓM LẠI:** **Intent** là câu hỏi tổng quát *("Trạng thái đơn hàng?")*, còn **Entity** là chi tiết đi lấp vào chỗ trống *("Mã đơn là ORD123")*. Bot trả lời nội dung gì là dựa vào **Intent**, nhưng data trích xuất để fetch từ Backend là nhờ **Entity**.

---

## 2. Khi bạn hỏi gì thì Bot sẽ trả lời cái đó? (Danh sách các Intents)

Thông qua thư mục `intents` trong cấu hình của bạn, Bot hiện tại hiểu được **10 Ý Định (Intents)** chính sau đây:

### 🔰 1. Nhóm Chào Hỏi & Từ chối hiểu
*   **`welcome`**: 
    *   **Khi nào hỏi:** "Hi", "Hello", "Chào shop", "Cho hỏi tí"...
    *   **Bot trả lời:** Câu chào mặc định giới thiệu bản thân là Trợ lý AI và đưa ra Quick Replies.
*   **`fallback`**: 
    *   **Khi nào hỏi:** "hihohoho", "sdjkfh", hoặc gõ linh tinh Bot không hiểu.
    *   **Bot trả lời:** "Lỗi kỹ thuật / Tôi chưa hiểu ý bạn" và gán nút gợi ý **"Chat với Admin"** để nhường quyền cho nhân viên.

### 📦 2. Nhóm Theo dõi & Xử lý đơn hàng
*   **`check_order`**: 
    *   **Khi nào hỏi:** "Kiểm tra mã đơn hàng", "Tình trạng đơn hàng ORD2024..."
    *   **Entities liên quan:** `order_id` (Ví dụ: ORD12345).
    *   **Bot trả lời:** Sẽ bắt `order_id`, gọi qua API Spring Boot của bạn (Webhook) để móc từ CSDL ra trạng thái (ví dụ: *Đã giao thành công*).
*   **`cancel_or_return`**: 
    *   **Khi nào hỏi:** "Cách hủy đơn?", "Trả hàng như thế nào?"
    *   **Bot trả lời:** Chính sách đổi trả và hủy đơn của cửa hàng.

### 🛏️ 3. Nhóm Sản phẩm (Nệm & Ga trải giường)
*   **`search_product`**: 
    *   **Khi nào hỏi:** "Tư vấn nệm cao su Liên Á", "Tìm đệm vừa tiền".
    *   **Entities liên quan:** `brand`, `mattress_type`, `price_range`, `firmness`, `material`.
    *   **Bot trả lời:** Danh sách sản phẩm gợi ý (có thể đã cài webhook móc từ DB).
*   **`product_detail`**: 
    *   **Khi nào hỏi:** "Nệm này kích thước 1m8 có màu xanh không?", "Nệm Wonjun Pure Carbon cấu tạo ra sao?".
    *   **Entities liên quan:** `size`, `color`, `product_type`.
    *   **Bot trả lời:** Thông tin chi tiết về kích thước, màu sắc của một mã cụ thể.
*   **`compare_product`**: 
    *   **Khi nào hỏi:** "Khác nhau giữa nệm lò xo và nệm bông ép?", "Nệm Liên Á và Kymdan cái nào mềm hơn?".
    *   **Entities liên quan:** `brand`, `mattress_type`.
    *   **Bot trả lời:** Bảng so sánh hoặc lời tư vấn so sánh ưu/nhược điểm.

### 💰 4. Nhóm Thông tin mua sắm
*   **`check_promotion`**: 
    *   **Khi nào hỏi:** "Đang có mã giảm giá nào không?", "Khuyến mãi tháng này".
    *   **Entities liên quan:** `promotion_type`.
    *   **Bot trả lời:** Cung cấp thông tin voucher / mã giảm giá.
*   **`payment_info`**: 
    *   **Khi nào hỏi:** "Bên mình trả góp được không?", "Có thanh toán qua the VNPay?".
    *   **Bot trả lời:** Phương thức thanh toán đang được hỗ trợ.
*   **`delivery_info`**: 
    *   **Khi nào hỏi:** "Bao lâu thì nhận được nệm?", "Giao Vũng Tàu giá ship bao nhiêu?".
    *   **Bot trả lời:** Cung cấp thông tin và cước phí vận chuyển.

---

## 3. Hệ Sinh Thái "Từ Khóa" (Danh sách Entities)

Để làm cho 10 Intents trên hoạt động thông minh, Dialogflow quét qua **10 bảng Entities** sau trong bộ não của nó:

1.  **`order_id`**: Định dạng mã đơn hàng (ví dụ: `O12345`, `ORD...`).
2.  **`brand`**: Tên thương hiệu (Liên Á, Kymdan, Wonjun,...).
3.  **`mattress_type`**: Loại nệm (Bông ép, Lò xo, Cao su,...).
4.  **`material`**: Chất liệu (Carbon, Foam, Bông,...).
5.  **`size`**: Kích thước (1m2, 1m6 x 2m, 180x200,...).
6.  **`color`**: Màu sắc (Trắng, Đỏ, Xanh,...).
7.  **`firmness`**: Độ cứng mềm (Cứng, Mới, Mềm, Êm ái,...).
8.  **`price_range`**: Khoảng giá (Dưới 3 triệu, Cao cấp, Rẻ,...).
9.  **`product_type`**: Phân loại (Nệm, Chăn ga, Gối,...).
10. **`promotion_type`**: Khuyến mãi (Giảm giá ship, Voucher, Sale,...).

**Kết luận:** Chatbot không tự biết trả lời ngoài những gì được cài đặt. Nó so khớp câu nói của người dùng => Chọn 1 **Intent** phù hợp => Lọc ra các **Entities** có giá trị tương ứng => (Nếu có bật Webhook) Bot gửi Intent+Entities về Java Backend (Spring Boot) => Backend truy xuất CSDL (MySQL/Mongo) => Gửi câu trả lời thành cuối cùng lên UI.
