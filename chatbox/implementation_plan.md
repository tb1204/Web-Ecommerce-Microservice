# Tích Hợp Chatbox (Bot + Admin) và ZIP file

Mục tiêu:
1. Thêm tính năng "Chat với Admin" dưới dạng Quick Reply mỗi khi chatbot (Dialogflow) trả lời.
2. Khi người dùng bấm "Chat với Admin", hệ thống ngay lập tức nhường quyền cho Admin trả lời (bot ngừng trả lời).
3. Đóng gói Agent Dialogflow hiện tại vào file ZIP để dễ dàng import lên mây.

## User Review Required

Không có cảnh báo đặc biệt, các thay đổi sẽ được thực hiện trực tiếp trong `chatservice` và tự động cập nhật nút "Chat với Admin" lên UI hiện tại. Vui lòng xác nhận để tôi bắt đầu tiến hành viết code.

## Proposed Changes

---

### Backend: `chatservice`

#### [MODIFY] [DialogflowService.java](file:///d:/luanvanhk2dvb/backend/chatservice/src/main/java/com/b2204925/chatservice/service/DialogflowService.java)
- Bổ sung logic tự động chèn thêm quick reply `"Chat với Admin"` vào mỗi phản hồi của Dialogflow nếu Dialogflow không tự trả về. Điều này đảm bảo mỗi khi chat với AI, người dùng luôn thấy nút chọn gọi Admin.

#### [MODIFY] [ChatWebSocketHandler.java](file:///d:/luanvanhk2dvb/backend/chatservice/src/main/java/com/b2204925/chatservice/websocket/ChatWebSocketHandler.java)
- Tại method xử lý nhắn tin `sendMessage`, nếu nội dung người dùng gửi lên (`req.getContent()`) là `"Chat với Admin"`, chúng ta sẽ:
  1. Hủy không gửi message này qua Dialogflow nữa.
  2. Tự động thông báo system: "Admin đã tham gia cuộc trò chuyện".
  3. Đổi trạng thái handoff của ticket/conversation để bot dừng trả lời và đẩy qua cho Admin xử lý.

### Dialogflow Agent ZIP
- Sử dụng lệnh PowerShell (`Compress-Archive`) để đóng gói thư mục `d:\luanvanhk2dvb\chatbox\mattress-agent` thành file `mattress-agent.zip`. 
- Cung cấp file `.zip` này thông qua hướng dẫn cho bạn sau khi khởi tạo thành công để bạn có thể import thẳng lên giao diện Dialogflow (Settings > Export and Import > Import from Zip).

## Verification Plan
1. Xác minh backend Spring Boot biên dịch thành công.
2. Cung cấp file path `.zip`.
3. Chờ User import lên Dialogflow, reload frontend và thử nghiệm quy trình Chat với Bot -> Bấm "Chat với Admin" -> Kiểm tra Admin Chat.
