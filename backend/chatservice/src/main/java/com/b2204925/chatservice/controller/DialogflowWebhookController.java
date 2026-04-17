package com.b2204925.chatservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat/dialogflow")
@RequiredArgsConstructor
@Slf4j
public class DialogflowWebhookController {

    private final RestTemplate restTemplate;

    @PostMapping("/webhook")
    public Map<String, Object> handleWebhook(@RequestBody Map<String, Object> request) {
        log.info("Received Webhook Request from Dialogflow: {}", request);

        Map<String, Object> queryResult = (Map<String, Object>) request.get("queryResult");
        
        String intentName = "";
        if (queryResult != null && queryResult.get("intent") != null) {
            Map<String, Object> intent = (Map<String, Object>) queryResult.get("intent");
            intentName = (String) intent.get("displayName");
        }
        
        Map<String, Object> parameters = queryResult != null ? (Map<String, Object>) queryResult.get("parameters") : null;

        // Câu trả lời mặc định nếu không xử lý được
        String responseText = "Xin lỗi, tôi không thể xử lý yêu cầu này lúc này.";

        try {
            if ("check_order".equals(intentName) || (queryResult != null && "check_order".equals(queryResult.get("action")))) {
                String orderId = parameters != null ? (String) parameters.get("order_id") : null;
                
                // Lấy toàn bộ câu chat của user để quét tìm mã đơn (phòng hờ Dialogflow bắt sai parameter)
                String queryText = (String) queryResult.get("queryText");
                if (queryText != null) {
                    java.util.regex.Matcher m = java.util.regex.Pattern.compile("(ORD\\d{14}|ORD\\d+)").matcher(queryText.toUpperCase());
                    if (m.find()) {
                        orderId = m.group(1); // Ưu tiên dùng ID do mã mình tự quét được trong chuỗi
                    }
                }

                if (orderId == null || orderId.isBlank() || !orderId.startsWith("ORD")) {
                    responseText = "Bạn vui lòng cung cấp đúng mã đơn hàng bắt đầu bằng chữ ORD. Ví dụ: ORD20260411064032.";
                } else {
                    responseText = fetchOrderStatus(orderId);
                }
            } else if ("check_promotion".equals(intentName)) {
                responseText = fetchPromotions();

            } else if ("search_product".equals(intentName)) {
                String brand = parameters != null ? (String) parameters.get("brand") : "";
                String mattressType = parameters != null ? (String) parameters.get("mattress_type") : "";
                String query = brand + " " + mattressType;
                
                responseText = searchProducts(query.trim());
                
            } else if ("product_detail".equals(intentName)) {
                String size = parameters != null ? (String) parameters.get("size") : "";
                responseText = "Bạn đang hỏi về kích thước: " + size + ". Rất tiếc hiện tại tính năng lọc riêng từng size thông qua Bot đang được bảo trì. Bạn chát với Admin nhé!";
                
            } else {
                // Nếu gọi webhook mà không thuộc các intent có bắt móc code, lấy giá trị fulfillmentText mặc định mà Dialogflow đã tạo
                if (queryResult != null && queryResult.get("fulfillmentText") != null) {
                    responseText = (String) queryResult.get("fulfillmentText");
                }
            }
        } catch (Exception e) {
            log.error("Lỗi khi gọi service khác qua Webhook", e);
            responseText = "Hệ thống đang bận hoặc không tìm thấy thông tin bạn yêu cầu, vui lòng thử lại sau.";
        }

        // Tạo JSON trả về đúng chuẩn Dialogflow WebhookResponse
        Map<String, Object> response = new HashMap<>();
        response.put("fulfillmentText", responseText);

        return response;
    }

    private String fetchPromotions() {
        try {
            String url = "http://voucher-service/api/vouchers"; 
            ResponseEntity<java.util.List> response = restTemplate.getForEntity(url, java.util.List.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                java.util.List<Map<String, Object>> vouchers = response.getBody();
                if (vouchers.isEmpty()) {
                    return "Hiện tại cửa hàng không có mã giảm giá nào kích hoạt.";
                }
                StringBuilder sb = new StringBuilder("Hiện tại cửa hàng có các khuyến mãi sau:\n");
                for (Map<String, Object> v : vouchers) {
                    String code = (String) v.get("code");
                    String desc = (String) v.get("description");
                    sb.append("- Mã ").append(code).append(": ").append(desc != null ? desc : "Khuyến mãi hấp dẫn").append("\n");
                }
                return sb.toString();
            }
        } catch (Exception e) {
            log.warn("Lỗi lấy voucher: {}", e.getMessage());
        }
        return "Xin lỗi, hiện tại tôi không thể lấy danh sách khuyến mãi. Bạn có thể xem trên web nhé!";
    }

    private String searchProducts(String query) {
        if (query == null || query.isBlank()) {
            return "Bạn muốn tìm sản phẩm gì? Bạn hãy cho mình biết tên hoặc thương hiệu nhé.";
        }
        try {
            String url = "http://product-service/api/products/search?q=" + query;
            ResponseEntity<java.util.List> response = restTemplate.getForEntity(url, java.util.List.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                java.util.List<Map<String, Object>> products = response.getBody();
                if (products.isEmpty()) {
                    return "Rất tiếc, mình không tìm thấy sản phẩm nào khớp với \"" + query + "\". Bạn thử xem qua các gợi ý trên trang web nhé.";
                }
                StringBuilder sb = new StringBuilder("Mình tìm thấy " + products.size() + " sản phẩm phù hợp:\n");
                int limit = Math.min(products.size(), 4);
                for (int i = 0; i < limit; i++) {
                    Map<String, Object> p = products.get(i);
                    String name = (String) p.get("name");
                    Number price = (Number) p.get("price");
                    sb.append("- ").append(name).append(" (Giá: ").append(String.format("%,d", price != null ? price.longValue() : 0)).append("đ)\n");
                }
                if (products.size() > limit) {
                    sb.append("... và nhiều sản phẩm khác!");
                }
                return sb.toString();
            }
        } catch (Exception e) {
            log.warn("Lỗi tìm sản phẩm: {}", e.getMessage());
        }
        return "Xin lỗi, hệ thống tìm kiếm đang bận. Bạn vui lòng tìm kiếm thủ công trên thanh tìm kiếm nhé!";
    }

    private String fetchOrderStatus(String orderId) {
        try {
            // Chuẩn hóa orderId nếu cần (ví dụ xoá khoảng trắng)
            orderId = orderId.trim();
            // Gọi qua order-service bằng mã orderNumber (VD: ORD20260...)
            String url = "http://order-service/api/orders/number/" + orderId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> order = response.getBody();
                String status = (String) order.get("orderStatus");
                
                // Trả về câu thông báo trạng thái
                return "Đơn hàng " + orderId + " của bạn hiện đang ở trạng thái: " + mapStatus(status) + ".";
            }
        } catch (Exception e) {
            log.warn("Không tìm thấy đơn hàng {} trong CSDL order-service.", orderId);
        }
        return "Tôi không tìm thấy đơn hàng mã " + orderId + " trong hệ thống. Bạn vui lòng kiểm tra lại mã nhé!";
    }

    private String mapStatus(String status) {
        if (status == null) return "Không xác định";
        return switch (status.toUpperCase()) {
            case "PENDING" -> "Đang chờ xử lý";
            case "PROCESSING" -> "Đang xử lý / đóng gói";
            case "SHIPPING" -> "Đang giao hàng";
            case "DELIVERED" -> "Đã giao thành công";
            case "CANCELLED" -> "Đã hủy";
            default -> status;
        };
    }
}
