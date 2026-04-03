package com.b2204922.notificationservice.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendNotificationEmail(String to, String subject, String customerName, String orderNumber, String status) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("[ARTISANO] " + subject);

            // Nội dung HTML cho đẹp
            String htmlContent = String.format(
                    "<div style='background-color: #f9fafb; padding: 40px 20px; font-family: \"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif;'>" +
                            "  <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;'>" +
                            "    " +
                            "    <div style='background-color: #10b981; padding: 25px; text-align: center;'>" +
                            "      <h1 style='color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;'>ARTISANO</h1>" +
                            "    </div>" +
                            "    " +
                            "    " +
                            "    <div style='padding: 30px; color: #374151; line-height: 1.6;'>" +
                            "      <h2 style='color: #111827; margin-top: 0;'>Chào %s!</h2>" +
                            "      <p style='font-size: 16px;'>Cảm ơn bạn đã lựa chọn Artisano. Chúng tôi rất vui được thông báo rằng đơn hàng của bạn đã có cập nhật mới.</p>" +
                            "      " +
                            "      <div style='background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #10b981;'>" +
                            "        <p style='margin: 0; font-size: 14px; color: #6b7280;'>Mã đơn hàng:</p>" +
                            "        <p style='margin: 5px 0 15px 0; font-weight: bold; font-size: 18px; color: #111827;'>#%s</p>" +
                            "        " +
                            "        <p style='margin: 0; font-size: 14px; color: #6b7280;'>Trạng thái hiện tại:</p>" +
                            "        <p style='margin: 5px 0 0 0; font-weight: bold; font-size: 18px; color: #10b981;'>%s</p>" +
                            "      </div>" +
                            "      " +
                            "      <p style='font-size: 16px;'>Hệ thống đang chuẩn bị các bước tiếp theo để sản phẩm sớm đến tay bạn nhất có thể.</p>" +
                            "      " +
//                            "      <div style='text-align: center; margin-top: 35px;'>" +
//                            "        <a href='http://localhost:5173/profile/orders' style='background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>Kiểm tra đơn hàng</a>" +
//                            "      </div>" +
                            "    </div>" +
                            "    " +
                            "    " +
                            "    <div style='background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;'>" +
                            "      <p style='margin: 0; color: #9ca3af; font-size: 12px;'>Đây là email tự động, vui lòng không phản hồi email này.</p>" +
                            "      <p style='margin: 5px 0 0 0; color: #9ca3af; font-size: 12px;'>&copy; 2026 Artisano </p>" +
                            "    </div>" +
                            "  </div>" +
                            "</div>",
                    customerName, orderNumber, status
            );

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Đã gửi Email thành công tới: {}", to);
        } catch (Exception e) {
            log.error("Lỗi gửi email tới {}: {}", to, e.getMessage());
        }
    }
}
