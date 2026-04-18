package com.b2204925.chatservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

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
        String queryText = queryResult != null ? (String) queryResult.get("queryText") : "";

        // Câu trả lời mặc định nếu không xử lý được
        String responseText = "Xin lỗi, tôi không thể xử lý yêu cầu này lúc này.";
        List<Map<String, Object>> productLinks = null;

        try {
            if ("fallback".equals(intentName) || "Default Fallback Intent".equals(intentName) || (queryResult != null && "sys.no-match-default".equals(queryResult.get("action")))) {
                responseText = "Xin lỗi, tôi chưa hiểu rõ ý của bạn. Bạn có thể nói rõ hơn về việc muốn tìm nệm, chăn ga, hay kiểm tra đơn hàng không ạ?";
                
            } else if ("check_order".equals(intentName) || (queryResult != null && "check_order".equals(queryResult.get("action")))) {
                String orderId = parameters != null ? (String) parameters.get("order_id") : null;

                // Quét toàn bộ câu chat để tìm mã ORD (phòng hờ Dialogflow parse sai)
                if (queryText != null) {
                    java.util.regex.Matcher m = java.util.regex.Pattern.compile("(ORD\\d{14}|ORD\\d+)").matcher(queryText.toUpperCase());
                    if (m.find()) {
                        orderId = m.group(1);
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
                // Tách keyword siêu chính xác từ queryText thay vì dựa hoàn toàn vào Entity
                String finalQuery = extractKeyword(queryText);
                
                // Nếu somehow query rỗng (user chỉ nhắn "shop ơi"), thử dùng entity
                if (finalQuery.isBlank()) {
                    String brand = safeStr(parameters, "brand");
                    String mattressType = safeStr(parameters, "mattress_type");
                    String productType = safeStr(parameters, "product_type");
                    finalQuery = (brand + " " + (mattressType.isBlank() ? productType : mattressType)).trim();
                }

                if (finalQuery.isBlank() || isStopWordOnly(finalQuery)) {
                    responseText = "Bạn muốn tìm sản phẩm gì? Bạn hãy cho mình biết tên hoặc thương hiệu nhé.";
                } else {
                    SearchResult result = searchProducts(finalQuery);
                    responseText = result.text;
                    productLinks = result.links;
                }

            } else if ("product_detail".equals(intentName)) {
                String size = safeStr(parameters, "size");

                // FIX: Nếu size entity rỗng → thử parse từ queryText
                if (size.isBlank() && queryText != null) {
                    size = extractSizeFromText(queryText);
                }

                if (!size.isBlank()) {
                    SearchResult result = searchProductBySize(size);
                    responseText = result.text;
                    productLinks = result.links;
                } else {
                    responseText = "Bạn cần tìm sản phẩm kích thước nào? Ví dụ: 180x200, 1m6...";
                }

            } else {
                // Không thuộc intent có webhook → lấy fulfillmentText mặc định từ Dialogflow
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

        // Đảm bảo Dialogflow luôn nhận được payload đúng chuẩn Map Node
        if (productLinks != null && !productLinks.isEmpty()) {
            Map<String, Object> payloadData = new HashMap<>();
            payloadData.put("productLinks", productLinks);

            Map<String, Object> customPayload = new HashMap<>();
            customPayload.put("payload", payloadData);

            response.put("fulfillmentMessages", List.of(
                    Map.of("text", Map.of("text", List.of(responseText))),
                    customPayload
            ));
        }

        log.info("Webhook Response: {}", response);
        return response;
    }

    // ── Helper: lấy string an toàn từ parameters map ─────────────────────────
    private String safeStr(Map<String, Object> params, String key) {
        if (params == null) return "";
        Object val = params.get(key);
        if (val == null) return "";
        String s = val.toString().trim();
        return "null".equalsIgnoreCase(s) ? "" : s;
    }

    // ── Helper: kiểm tra xem query có chỉ toàn stop-words không ──────────────
    private boolean isStopWordOnly(String query) {
        Set<String> stopWords = Set.of("tôi", "mình", "bạn", "shop", "cho", "có", "bán", "không",
                "tìm", "xem", "hàng", "sản", "phẩm", "danh", "sách", "null", "");
        String[] words = query.toLowerCase().split("\\s+");
        for (String w : words) {
            if (!stopWords.contains(w)) return false;
        }
        return true;
    }

    // ── Helper: trích keyword từ queryText, bỏ stop-words phổ biến ───────────
    private String extractKeyword(String queryText) {
        if (queryText == null || queryText.isBlank()) return "";
        // Các cụm stop-word phổ biến ở đầu câu hỏi tìm kiếm
        String cleaned = queryText
                .replaceAll("(?i)tìm (cho)?\\s*(tôi|mình)?\\s*", "")
                .replaceAll("(?i)shop có bán\\s*", "")
                .replaceAll("(?i)cho (tôi|mình) xem\\s*", "")
                .replaceAll("(?i)có bán\\s*", "")
                .replaceAll("(?i)hỏi\\s*", "")
                .replaceAll("(?i)\\s+không[?]?$", "")
                .trim();
        return cleaned;
    }

    // ── Helper: trích kích thước từ câu text thuần ────────────────────────────
    private String extractSizeFromText(String text) {
        if (text == null) return "";
        // Match patterns: 180x200, 1m8, 1m6, 1.8x2m, 1m8 x 2m, v.v.
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("(\\d+x\\d+|\\d[,.]?\\d*m\\d*(?:\\s*x\\s*\\d[,.]?\\d*m)?|1m[248]|1m6)", 
                         java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(text);
        return m.find() ? m.group(1).replaceAll("\\s+", "") : "";
    }

    // ── Lấy danh sách khuyến mãi active ──────────────────────────────────────
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
                    String type = (String) v.get("voucherType");
                    String dType = (String) v.get("discountType");
                    Number val = (Number) v.get("discountValue");

                    String desc = "Khuyến mãi hấp dẫn";
                    if ("SHIPPING_DISCOUNT".equalsIgnoreCase(type)) {
                        desc = "Miễn phí vận chuyển";
                        if (val != null && val.longValue() > 0) {
                            desc += " (Tối đa " + String.format("%,d", val.longValue()) + "đ)";
                        }
                    } else if ("PRODUCT_DISCOUNT".equalsIgnoreCase(type)) {
                        if ("PERCENTAGE".equalsIgnoreCase(dType)) {
                            desc = "Giảm giá sản phẩm " + val + "%";
                        } else {
                            desc = "Giảm giá sản phẩm " + String.format("%,d", val != null ? val.longValue() : 0) + "đ";
                        }
                    }

                    sb.append("- Mã ").append(code).append(": ").append(desc).append("\n");
                }
                return sb.toString();
            }
        } catch (Exception e) {
            log.warn("Lỗi lấy voucher: {}", e.getMessage());
        }
        return "Xin lỗi, hiện tại tôi không thể lấy danh sách khuyến mãi. Bạn có thể xem trên web nhé!";
    }

    // ── Tìm sản phẩm theo từ khóa ─────────────────────────────────────────────
    private SearchResult searchProducts(String query) {
        if (query == null || query.isBlank()) {
            return new SearchResult("Bạn muốn tìm sản phẩm gì? Bạn hãy cho mình biết tên hoặc thương hiệu nhé.", null);
        }
        try {
            String encodedQuery = java.net.URLEncoder.encode(query, java.nio.charset.StandardCharsets.UTF_8);
            String url = "http://product-service/api/products/search?q=" + encodedQuery;
            ResponseEntity<java.util.List> response = restTemplate.getForEntity(url, java.util.List.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                java.util.List<Map<String, Object>> products = response.getBody();
                if (products.isEmpty()) {
                    return new SearchResult(
                        "Rất tiếc, mình không tìm thấy sản phẩm nào khớp với \"" + query + "\". Bạn thử xem qua các gợi ý trên trang web nhé.",
                        null
                    );
                }
                int limit = Math.min(products.size(), 4);
                StringBuilder sb = new StringBuilder("Mình tìm thấy " + products.size() + " sản phẩm phù hợp:\n");
                List<Map<String, Object>> links = new ArrayList<>();

                for (int i = 0; i < limit; i++) {
                    Map<String, Object> p = products.get(i);
                    String name = (String) p.get("name");
                    Number price = (Number) p.get("price");
                    String slug = (String) p.get("slug");
                    long priceVal = price != null ? price.longValue() : 0;

                    sb.append("- ").append(name)
                      .append(" (Giá từ: ").append(String.format("%,d", priceVal)).append("đ)\n");

                    Map<String, Object> link = new HashMap<>();
                    link.put("name", name);
                    link.put("slug", slug != null ? slug : "");
                    link.put("price", priceVal);
                    links.add(link);
                }
                if (products.size() > limit) {
                    sb.append("... và nhiều sản phẩm khác trên website!");
                }
                return new SearchResult(sb.toString(), links);
            }
        } catch (Exception e) {
            log.warn("Lỗi tìm sản phẩm: {}", e.getMessage());
        }
        return new SearchResult("Xin lỗi, hệ thống tìm kiếm đang bận. Bạn vui lòng tìm kiếm thủ công trên trang chủ nhé!", null);
    }

    // ── Tìm sản phẩm theo kích thước ──────────────────────────────────────────
    private SearchResult searchProductBySize(String size) {
        try {
            String url = "http://product-service/api/products/all";
            ResponseEntity<java.util.List> response = restTemplate.getForEntity(url, java.util.List.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                java.util.List<Map<String, Object>> products = response.getBody();
                java.util.List<Map<String, Object>> matched = new ArrayList<>();

                // Normalize input của user → lấy phần chiều rộng VD: "180"
                // DB lưu: "120 x 200", "140 x 200", "160 x 200", "180 x 200", "220 x 200"
                String normalizedInput = normalizeSize(size);
                String targetWidth = extractWidth(normalizedInput); // VD: "180"

                log.info("Tìm sản phẩm kích thước: input='{}' → normalized='{}' → width='{}'",
                        size, normalizedInput, targetWidth);

                for (Map<String, Object> p : products) {
                    Object variantsObj = p.get("variants");
                    if (variantsObj instanceof java.util.List) {
                        java.util.List<Map<String, Object>> variants =
                                (java.util.List<Map<String, Object>>) variantsObj;
                        for (Map<String, Object> v : variants) {
                            String vSize = (String) v.get("size");
                            if (vSize != null) {
                                // Normalize DB size cùng cách → lấy width
                                String dbWidth = extractWidth(normalizeSize(vSize));
                                if (dbWidth.equals(targetWidth)) {
                                    matched.add(p);
                                    break; // chỉ thêm sản phẩm 1 lần dù có nhiều variant khớp
                                }
                            }
                        }
                    }
                }

                // Label hiển thị thân thiện
                String sizeLabel = toFriendlySize(targetWidth);

                if (matched.isEmpty()) {
                    return new SearchResult(
                        "Rất tiếc, mình không tìm thấy sản phẩm nào có kích thước " + sizeLabel + ". " +
                        "Shop đang có các size: 1m2, 1m4, 1m6, 1m8 và 2m2.",
                        null
                    );
                }

                int limit = Math.min(matched.size(), 4);
                StringBuilder sb = new StringBuilder(
                    "Mình tìm thấy " + matched.size() + " sản phẩm có kích thước " + sizeLabel + ":\n"
                );
                List<Map<String, Object>> links = new ArrayList<>();

                for (int i = 0; i < limit; i++) {
                    Map<String, Object> p = matched.get(i);
                    String name = (String) p.get("name");
                    Number price = (Number) p.get("price");
                    String slug = (String) p.get("slug");
                    long priceVal = price != null ? price.longValue() : 0;

                    sb.append("- ").append(name)
                      .append(" (Giá từ: ").append(String.format("%,d", priceVal)).append("đ)\n");

                    Map<String, Object> link = new HashMap<>();
                    link.put("name", name);
                    link.put("slug", slug != null ? slug : "");
                    link.put("price", priceVal);
                    links.add(link);
                }
                if (matched.size() > limit) {
                    sb.append("... và ").append(matched.size() - limit).append(" sản phẩm khác trên website!");
                }
                return new SearchResult(sb.toString(), links);
            }
        } catch (Exception e) {
            log.warn("Lỗi tìm theo kích thước: {}", e.getMessage());
        }
        return new SearchResult("Xin lỗi, hệ thống lọc kích thước đang bảo trì. Vui lòng chat với Admin nhé!", null);
    }

    // ── Convert width number → label thân thiện ───────────────────────────────
    private String toFriendlySize(String width) {
        return switch (width) {
            case "120" -> "1m2 x 2m (120 x 200)";
            case "140" -> "1m4 x 2m (140 x 200)";
            case "160" -> "1m6 x 2m (160 x 200)";
            case "180" -> "1m8 x 2m (180 x 200)";
            case "220" -> "2m2 x 2m (220 x 200)";
            default -> width + " x 200";
        };
    }

    // ── Normalize size: convert mọi cách viết về dạng "NNNx200" ─────────────
    // DB lưu dạng "120 x 200", "180 x 200" — cần normalize để so sánh
    private String normalizeSize(String size) {
        if (size == null) return "";
        String s = size.toLowerCase()
                       .replaceAll("\\s+", "")   // bỏ khoảng trắng
                       .replace("cm", "")         // bỏ đuôi cm
                       .replace("kingsize", "220");

        // Convert chữ viết tắt mét → số (thứ tự: 2m2 TRƯỚC 2m, 1mX TRƯỚC 1m)
        s = s.replace("2m2", "220")
             .replace("2.2m", "220")
             .replace("1m8", "180")
             .replace("1.8m", "180")
             .replace("1m6", "160")
             .replace("1.6m", "160")
             .replace("1m4", "140")
             .replace("1.4m", "140")
             .replace("1m2", "120")
             .replace("1.2m", "120")
             .replace("2m", "200");   // chỉ "2m" đơn thuần = 200

        // Bỏ đuôi "x200" nếu dư (để chỉ giữ phần chiều rộng khi cần)
        // Giữ nguyên dạng "NNNxMMM" để so sánh
        return s;
    }

    // ── Extract width từ size đã normalize, VD "180x200" → "180" ─────────────
    private String extractWidth(String normalizedSize) {
        if (normalizedSize.contains("x")) {
            return normalizedSize.split("x")[0];
        }
        return normalizedSize; // đã là số thuần (VD: "180")
    }

    // ── Lấy trạng thái đơn hàng ──────────────────────────────────────────────
    private String fetchOrderStatus(String orderId) {
        try {
            orderId = orderId.trim();
            String url = "http://order-service/api/orders/number/" + orderId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> order = response.getBody();
                String status = (String) order.get("orderStatus");
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

    // ── Inner class kết quả tìm kiếm ──────────────────────────────────────────
    private static class SearchResult {
        final String text;
        final List<Map<String, Object>> links;

        SearchResult(String text, List<Map<String, Object>> links) {
            this.text = text;
            this.links = links;
        }
    }
}
