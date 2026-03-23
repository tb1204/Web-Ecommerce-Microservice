package com.b2204925.paymentservice.util;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TimeZone;   // ← thêm
import java.util.TreeMap;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class VNPayUtil {

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.hash-secret}")
    private String hashSecret;

    @Value("${vnpay.url}")
    private String vnpayUrl;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    private static final TimeZone VN_TIMEZONE = TimeZone.getTimeZone("Asia/Ho_Chi_Minh");  // ← thêm

    public String buildPaymentUrl(String orderId, Long amount, String clientIp) {
        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", String.valueOf(amount * 100)); //đơn vị xu 
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", orderId);
        params.put("vnp_OrderInfo", "Thanh toan don hang " + orderId);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", clientIp != null ? clientIp : "127.0.0.1");
        params.put("vnp_CreateDate", getCurrentTime());  // ← sửa
        params.put("vnp_ExpireDate", getExpireDate());

        String queryString = buildQueryString(params);
        String secureHash = hmacSHA512(hashSecret, queryString);
        return vnpayUrl + "?" + queryString + "&vnp_SecureHash=" + secureHash;
    }

    public boolean verifyReturn(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null) {
            return false;
        }
        Map<String, String> filtered = new TreeMap<>(params);
        filtered.remove("vnp_SecureHash");
        filtered.remove("vnp_SecureHashType");
        String queryString = buildQueryString(filtered);
        String expectedHash = hmacSHA512(hashSecret, queryString);
        return expectedHash.equalsIgnoreCase(receivedHash);
    }

    private String getCurrentTime() {   // ← thêm method
        SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmss");
        fmt.setTimeZone(VN_TIMEZONE);
        return fmt.format(new Date());
    }

    private String getExpireDate() {    // ← sửa method
        SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmss");
        fmt.setTimeZone(VN_TIMEZONE);
        Calendar cal = Calendar.getInstance(VN_TIMEZONE);
        cal.add(Calendar.MINUTE, 15);
        return fmt.format(cal.getTime());
    }

    private String buildQueryString(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (sb.length() > 0) {
                sb.append("&");
            }
            sb.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
            sb.append("=");
            sb.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
        }
        return sb.toString();
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("VNPay hash error", e);
        }
    }
    // Thêm vào VNPayUtil.java

    public String getResponseMessage(String responseCode) {
        Map<String, String> messages = new LinkedHashMap<>();
        messages.put("00", "Giao dịch thành công");
        messages.put("07", "Trừ tiền thành công. Giao dịch bị nghi ngờ gian lận");
        messages.put("09", "Giao dịch không thành công: Thẻ chưa đăng ký Internet Banking");
        messages.put("10", "Giao dịch không thành công: Xác thực thông tin thẻ sai quá 3 lần");
        messages.put("11", "Giao dịch không thành công: Hết thời gian chờ thanh toán");
        messages.put("12", "Giao dịch không thành công: Thẻ/Tài khoản bị khóa");
        messages.put("13", "Giao dịch không thành công: Nhập sai OTP");
        messages.put("24", "Giao dịch không thành công: Khách hàng hủy giao dịch");
        messages.put("51", "Giao dịch không thành công: Tài khoản không đủ số dư");
        messages.put("65", "Giao dịch không thành công: Vượt quá hạn mức giao dịch trong ngày");
        messages.put("75", "Ngân hàng thanh toán đang bảo trì");
        messages.put("79", "Giao dịch không thành công: Nhập sai mật khẩu thanh toán quá số lần");
        messages.put("99", "Lỗi không xác định");
        return messages.getOrDefault(responseCode, "Lỗi không xác định: " + responseCode);
    }
}
