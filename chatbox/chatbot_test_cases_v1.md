# 🧪 Bộ câu hỏi test chatbot nệm

> Copy từng câu hỏi vào chatbox, kiểm tra xem bot trả lời đúng không.

---

## ✅ 1. Chào hỏi (Intent: `welcome`)

| # | Câu hỏi (copy vào chat) | Câu trả lời kỳ vọng |
|---|---|---|
| 1 | `Xin chào` | Chào mừng bạn đến với shop nệm... (có gợi ý các chức năng) |
| 2 | `Hi shop ơi` | Chào mừng bạn đến với shop nệm... |
| 3 | `Cho mình hỏi` | Chào mừng bạn đến với shop nệm... |

---

## ✅ 2. Kiểm tra khuyến mãi (Intent: `check_promotion`) — GỌI BACKEND

| # | Câu hỏi (copy vào chat) | Câu trả lời kỳ vọng |
|---|---|---|
| 4 | `Shop có khuyến mãi gì không` | Hiện tại cửa hàng có các khuyến mãi sau: - Mã LTD: ... - Mã FREE: ... |
| 5 | `Có mã giảm giá nào không` | Hiện tại cửa hàng có các khuyến mãi sau: ... |
| 6 | `Cho mình biết các mã ưu đãi hiện tại` | Hiện tại cửa hàng có các khuyến mãi sau: ... |

> ⚠️ Nếu bot trả lời **không lấy được" hay "không có mã nào** → webhook lỗi.

---

## ✅ 3. Kiểm tra đơn hàng (Intent: `check_order`) — GỌI BACKEND

| # | Câu hỏi (copy vào chat) | Câu trả lời kỳ vọng |
|---|---|---|
| 7 | `Kiểm tra giúp mã đơn ORD1234` | "Tôi không tìm thấy đơn hàng mã ORD1234..." (vì ORD1234 không tồn tại trong DB) |
| 8 | `Đơn hàng của tôi đâu rồi, mã ORD1234` | "Tôi không tìm thấy đơn hàng..." |
| 9 | `Kiểm tra đơn ORD20260411064032` | Đơn hàng ORD20260411064032 hiện đang ở trạng thái: **Đang chờ xử lý** (nếu tồn tại trong DB) |
| 10 | `Tôi muốn biết trạng thái đơn hàng abc123` | "Bạn vui lòng cung cấp đúng mã đơn hàng bắt đầu bằng chữ ORD..." |

> ⚠️ Nếu bot trả lời "Đang tra cứu đơn hàng..." mà không trả lời được → webhook lỗi.  
> ORD1234 là mã TEST không tồn tại → bot phải nói "không tìm thấy" chứ KHÔNG phải im lặng.

---

## ✅ 4. Tìm kiếm sản phẩm theo từ khoá (Intent: `search_product`) — GỌI BACKEND

| # | Câu hỏi (copy vào chat) | Câu trả lời kỳ vọng |
|---|---|---|
| 11 | `Tìm nệm cao su` | Mình tìm thấy X sản phẩm phù hợp: - [tên sản phẩm] (Giá từ: ...) |
| 12 | `Shop có bán nệm Dunlopillo không` | Mình tìm thấy X sản phẩm phù hợp: ... |
| 13 | `Cho mình xem nệm lò xo` | Mình tìm thấy X sản phẩm phù hợp: ... |
| 14 | `Nệm bông ép có không` | Mình tìm thấy X sản phẩm phù hợp: ... |
| 15 | `Tìm nệm Wonjun` | Mình tìm thấy X sản phẩm phù hợp: ... |
| 16 | `Nệm Gummi` | Mình tìm thấy X sản phẩm phù hợp: ... |

> ⚠️ Nếu bot trả lời "Đây là các sản phẩm..." mà **không có danh sách** → webhook lỗi.

---

## ✅ 5. Tìm sản phẩm theo kích thước (Intent: `product_detail`) — GỌI BACKEND

| # | Câu hỏi (copy vào chat) | Câu trả lời kỳ vọng |
|---|---|---|
| 17 | `Đệm này có kích thước 1m8 x 2m không` | Mình tìm thấy X sản phẩm có kích thước 1m8 x 2m (180 x 200): ... |
| 18 | `Cho mình xem nệm kích thước 180x200` | Mình tìm thấy X sản phẩm có kích thước... |
| 19 | `Có nệm 1m6 không` | Mình tìm thấy X sản phẩm có kích thước 1m6 x 2m... |
| 20 | `Nệm kích thước 1m4` | Mình tìm thấy X sản phẩm có kích thước 1m4 x 2m... |
| 21 | `Có size 2m2 không` | Mình tìm thấy X sản phẩm... |
| 22 | `Nệm 160x200` | Mình tìm thấy X sản phẩm... |

> ⚠️ Nếu bot trả lời "Dưới đây là thông tin chi tiết:" mà **không có gì** → webhook lỗi.

---

## ✅ 6. Thông tin giao hàng (Intent: `delivery_info`) — Static

| # | Câu hỏi (copy vào chat) | Câu trả lời kỳ vọng |
|---|---|---|
| 23 | `Ship hàng mấy ngày` | Thông tin về thời gian giao hàng... |
| 24 | `Có giao hàng tận nơi không` | Thông tin về giao hàng... |
| 25 | `Phí vận chuyển bao nhiêu` | Thông tin về phí ship... |

---

## ✅ 7. Thông tin thanh toán (Intent: `payment_info`) — Static

| # | Câu hỏi (copy vào chat) | Câu trả lời kỳ vọng |
|---|---|---|
| 26 | `Thanh toán bằng cách nào` | Thông tin về các hình thức thanh toán... |
| 27 | `Có thanh toán COD không` | Thông tin về COD... |
| 28 | `Mình muốn trả góp được không` | Thông tin về thanh toán... |

---

## ✅ 8. Fallback (câu hỏi nằm ngoài phạm vi)

| # | Câu hỏi (copy vào chat) | Câu trả lời kỳ vọng |
|---|---|---|
| 29 | `Bạn tên gì` | "Xin lỗi, tôi chưa hiểu rõ ý của bạn..." |
| 30 | `Thời tiết hôm nay thế nào` | "Xin lỗi, tôi chưa hiểu rõ ý của bạn..." |
| 31 | `asdfghjkl` | "Xin lỗi, tôi chưa hiểu rõ ý của bạn..." |

---

## 📋 Bảng tóm tắt kết quả test

| Intent | Câu # | Kết quả (✅/❌) | Ghi chú |
|---|---|---|---|
| welcome | 1-3 | | |
| check_promotion | 4-6 | | Phải gọi DB |
| check_order | 7-10 | | Phải gọi DB |
| search_product | 11-16 | | Phải gọi DB |
| product_detail | 17-22 | | Phải gọi DB |
| delivery_info | 23-25 | | Static |
| payment_info | 26-28 | | Static |
| fallback | 29-31 | | |

---

## 🔍 Cách phân biệt webhook hoạt động hay không

| Triệu chứng | Nguyên nhân |
|---|---|
| Bot trả lời "Đang tra cứu đơn hàng..." và dừng | Webhook bị 401 → Dialogflow dùng fallback speech |
| Bot trả lời "Dưới đây là thông tin chi tiết:" và dừng | Webhook bị 401 → Dialogflow dùng fallback speech |
| Bot trả lời "Đây là các sản phẩm bạn đang tìm kiếm:" và dừng | Webhook bị 401 |
| Bot trả lời đúng với danh sách sản phẩm/mã voucher | ✅ Webhook OK |
