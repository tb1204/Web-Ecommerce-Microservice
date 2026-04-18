# 🤖 Hướng Dẫn Test Tự Nhập (Chatbot Artisano)

Đây là tài liệu chi tiết 100% dựa trên những gì Agent và Backend đang chạy. Bạn hãy copy hoặc gõ lại **y chang các câu in đậm** ở mục **"Bạn gõ"** vào khung chat để kiểm chứng!

---

## 🟢 NHÓM 1: CÁC CÂU CƠ BẢN (KHÔNG CÓ NÚT XEM NGAY)

### 1. Intent `welcome` (Mở đầu)
- **Bạn gõ:** `Hi` hoặc `Chào shop`
- **Bot sẽ trả lời:** "Xin chào! Tôi là Trợ lý AI của Cửa hàng Nệm & Chăn Ga. Tôi có thể giúp bạn tìm hiểu chi tiết sản phẩm, tư vấn chọn nệm theo tình trạng sức khỏe, hoặc giải quyết vấn đề về đơn hàng nhé!"

### 2. Intent `payment_info` (Hỏi Thanh Toán VNPAY / COD)
- **Bạn gõ:** `Mình thanh toán online được không?` *(Hoặc: `Bên mình có thanh toán VNPay không?`)*
- **Bot sẽ trả lời:** "Chúng mình đang hỗ trợ 2 hình thức thanh toán chính: 1. Thanh toán tiền mặt khi nhận hàng (COD). 2. Thanh toán trực tuyến an toàn qua cổng VNPAY. Mọi giao dịch điện tử đều được bảo vệ!"

### 3. Intent `delivery_info` (Hỏi Phí Ship)
- **Bạn gõ:** `Phí ship tính thế nào?` *(Hoặc: `Miễn phí vận chuyển không?`)*
- **Bot sẽ trả lời:** "Phí ship là 30.000đ cho mọi tỉnh thành và đơn từ 3.000.000đ thì được free ship bạn nhé!"

### 4. Intent `cancel_or_return` (Hỏi Đổi Trả)
- **Bạn gõ:** `Tôi muốn trả hàng` *(Hoặc: `Chính sách đổi trả như thế nào?`)*
- **Bot sẽ trả lời:** "Chính sách đổi trả lên đến 100 ngày nếu lún xẹp. Bạn vui lòng chuẩn bị ảnh chụp sản phẩm và nhấn nút Chat với Admin để nhân viên hỗ trợ nhé."

---

## 🔵 NHÓM 2: TEST TÌM KIẾM CÓ DATA & NÚT "XEM NGAY"

### 5. Intent `search_product` (Tìm chung chung / Tìm hãng)
Đây là tính năng đã được nâng cấp siêu mạnh, tự bóc tách keyword.

- **Test case 1:**
  - **Bạn gõ:** `Shop có bán nệm lò xo không?`
  - **Bot sẽ trả lời:** Sẽ filter Database với keyword là **"nệm lò xo"**. Bot sẽ liệt kê các nệm lò xo có trong DB kèm theo giá và **Nút Xem Ngay** màu gradient bên dưới.
- **Test case 2:** 
  - **Bạn gõ:** `Tìm cho tôi đệm cao su Kymdan`
  - **Bot sẽ trả lời:** Liệt kê các nệm Kymdan cao su, kèm giá gốc / giá giảm và Nút **Xem Ngay**.

### 6. Intent `product_detail` (Tìm chính xác KÍCH THƯỚC)
Tính năng này sẽ convert "1m8" hay "1m6" về format chuẩn trong DB (180 x 200).

- **Test case 1 (Chuẩn size 1.8m):**
  - **Bạn gõ:** `Đệm này có kích thước 1m8 x 2m không?`
  - **Bot sẽ trả lời:** "Mình tìm thấy X sản phẩm có kích thước 1m8 x 2m (180 x 200):..." và hiện danh sách nệm (VD: Nệm bông ép Wonjun...) **KÈM THEO NÚT XEM NGAY**. (Khi bạn nhấp nút Xem Ngay nó sẽ đưa bạn tới `/product/:id` thay vì lỗi nữa).
- **Test case 2 (Hỏi size 1.6m):**
  - **Bạn gõ:** `Có size 1m6 không?`
  - **Bot sẽ trả lời:** Hiện các sản phẩm có size phân loại (160 x 200) kèm giá và nút Xem Ngay.

### 7. Intent `check_promotion` (Hỏi xem có mã Voucher không)
- **Bạn gõ:** `Cửa hàng đang có voucher nào không?`
- **Bot sẽ call Backend và báo mã còn Valid:** Ví dụ "Hiện tại cửa hàng có các khuyến mãi sau: Mã LTD... Mã FREE..." (Sẽ lấy trực tiếp từ bảng voucher dưới MongoDB của bạn).

### 8. Intent `check_order` (Tra cứu mã đơn hàng)
- **Bạn gõ:** `Kiểm tra giúp mình mã đơn hàng ORD20260411064032` (Lấy một mã đơn `ORD...` bất kỳ đang có trong Database của bạn).
- **Bot sẽ call Backend báo Status:** Ví dụ: "Đơn hàng ORD20260411064032 của bạn hiện đang ở trạng thái: Đã giao thành công."

---

## 🔴 NHÓM 3: TEST LỖI FALLBACK (Hệ thống chống trượt)

### 9. Intent `fallback` (Nhập Tào Lao)
- **Bạn gõ:** `abcmls sdsld dsjdjs` (Hoặc bất cứ cụm từ nào không nghĩa).
- **Bot sẽ KÍCH HOẠT WEBHOOK VÀ BÁO LỖI:** 
  "Xin lỗi, tôi chưa hiểu rõ ý của bạn. Bạn có thể nói rõ hơn về việc muốn tìm nệm, chăn ga, hay kiểm tra đơn hàng không ạ?"
  **(Kèm theo đó:** Ở màn hình Chat Admin sẽ xuất hiện cảnh báo Handoff vì Bot không xử lý được, nút Chat Bot bên góc phải của User biến thành chat Admin).

### 10. SO SÁNH SẢN PHẨM KHÔNG CÒN TỒN TẠI
- **Bạn gõ:** `Nệm cao su và nệm lò xo khác nhau thế nào`
- **Bot hiện tại sẽ:** Do bạn đã yêu cầu **xoá** Intent So sánh (Compare Product) khỏi hệ thống, nên Dialogflow sẽ **không trả lời câu cũ nữa**. Thay vào đó, nó sẽ đánh giá câu này vào **`search_product`** (Tìm các sản phẩm nệm) HOẶC rơi vào **`Fallback`**. 

---

### Xác minh thành công bao gồm các điều kiện:
1. Nút "Xem Ngay" màu xanh lục gradient **HIỂN THỊ HIỆN DIỆN**.
2. Click vào Nút Xem Ngay sẽ **CHUYỂN HƯỚNG** vào đúng màn hình Chi Tiết Sản Phẩm `/product/69cfxxxxx`.
3. Câu hỏi về phí ship **ĐÚNG** con số 30,000đ.
4. Nhập rác bị báo `Xin lỗi tôi chưa hiểu...` chứ không bị im re hoặc trắng trơn. 

Bạn hãy Test đúng các Text ở mục "Bạn Gõ" nhé! Đảm bảo mọi thứ chạy mượt.
