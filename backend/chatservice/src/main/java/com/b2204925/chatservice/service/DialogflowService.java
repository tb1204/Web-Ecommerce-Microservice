package com.b2204925.chatservice.service;

import com.b2204925.chatservice.dto.res.DialogflowResponse;
import com.b2204925.chatservice.entity.MessageMetadata;
import com.google.auth.oauth2.GoogleCredentials;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class DialogflowService {

    @Value("${dialogflow.project-id}")
    private String projectId;

    @Value("${dialogflow.language-code}")
    private String languageCode;

    private GoogleCredentials credentials;

    // ✅ Dùng @LoadBalanced RestTemplate bean để gọi product-service qua service discovery
    private final RestTemplate lbRestTemplate;

    // RestTemplate riêng chỉ để gọi Google Dialogflow API (không cần load balancer)
    private final RestTemplate googleRestTemplate = new RestTemplate();

    @Autowired
    public DialogflowService(RestTemplate restTemplate) {
        this.lbRestTemplate = restTemplate;
    }

    @PostConstruct
    public void init() {
        try {
            InputStream keyStream = new ClassPathResource("dialogflow-key.json").getInputStream();
            this.credentials = GoogleCredentials.fromStream(keyStream)
                    .createScoped("https://www.googleapis.com/auth/cloud-platform");
            log.info("Khởi tạo GoogleCredentials từ dialogflow-key.json thành công! Chatbot đã kích hoạt đầy đủ.");
        } catch (Exception e) {
            log.error("Tuyệt đối không tìm thấy tệp dialogflow-key.json hoặc đọc lỗi: ", e);
        }
    }

    public DialogflowResponse detectIntent(String sessionId, String text) {
        if (this.credentials == null) {
            log.error("GoogleCredentials bị null do thiếu file lúc khởi động.");
            return DialogflowResponse.builder()
                    .responseText("🚨 Lỗi: Thiếu file cấu hình Dialogflow (dialogflow-key.json).")
                    .intent("fallback")
                    .confidence(1.0)
                    .isFallback(false)
                    .quickReplies(List.of())
                    .build();
        }

        try {
            // Lấy/Refresh Access Token
            this.credentials.refreshIfExpired();
            String accessToken = this.credentials.getAccessToken().getTokenValue();

            String url = "https://dialogflow.googleapis.com/v2/projects/"
                    + projectId + "/agent/sessions/" + sessionId + ":detectIntent";

            Map<String, Object> queryInput = Map.of(
                    "text", Map.of(
                            "text", text,
                            "languageCode", languageCode
                    )
            );

            Map<String, Object> requestBody = Map.of("queryInput", queryInput);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = googleRestTemplate.postForEntity(url, entity, Map.class);

            // ── Parse queryResult
            Map queryResult = (Map) response.getBody().get("queryResult");

            String fulfillmentText = (String) queryResult.get("fulfillmentText");
            String queryText       = (String) queryResult.get("queryText");

            Map intent = (Map) queryResult.get("intent");
            String intentName = intent != null ? (String) intent.get("displayName") : null;

            Object confObj = queryResult.get("intentDetectionConfidence");
            Double confidence = confObj instanceof Number ? ((Number) confObj).doubleValue() : 0.0;
            boolean isFallback = intentName != null && intentName.toLowerCase().contains("fallback");

            Map<String, Object> parameters = queryResult.get("parameters") instanceof Map
                    ? (Map<String, Object>) queryResult.get("parameters") : null;

            // ── Parse quickReplies từ fulfillmentMessages (Dialogflow relay quickReplies đáng tin cậy)
            List<String> quickReplies = new ArrayList<>();
            var fulfillmentMessages = (List<?>) queryResult.get("fulfillmentMessages");
            if (fulfillmentMessages != null) {
                for (Object msgObj : fulfillmentMessages) {
                    Map msgMap = (Map) msgObj;
                    Map quickRepliesMap = (Map) msgMap.get("quickReplies");
                    if (quickRepliesMap != null) {
                        List<String> rawReplies = (List<String>) quickRepliesMap.get("quickReplies");
                        if (rawReplies != null) quickReplies.addAll(rawReplies);
                    }
                }
            }

            // ── Tự fetch productLinks trực tiếp từ product-service (KHÔNG phụ thuộc Dialogflow relay payload)
            // Dialogflow ES REST API không relay custom payload từ webhook một cách đáng tin cậy
            List<MessageMetadata.ProductLink> productLinks = new ArrayList<>();
            productLinks = fetchProductLinksForIntent(intentName, queryText, parameters);

            log.info("Dialogflow trả lời: intent={} | confidence={} | productLinks={}",
                    intentName, confidence, productLinks.size());

            return DialogflowResponse.builder()
                    .responseText(fulfillmentText)
                    .intent(intentName)
                    .confidence(confidence)
                    .isFallback(isFallback)
                    .quickReplies(quickReplies)
                    .productLinks(productLinks.isEmpty() ? null : productLinks)
                    .build();

        } catch (Exception e) {
            log.error("Lỗi khi kết nối Google Dialogflow API: ", e);
            String errorMessage = e.getMessage() != null ? e.getMessage() : e.toString();
            return DialogflowResponse.builder()
                    .responseText("🚨 Lỗi kỹ thuật từ Google: " + errorMessage + "\n(Hãy kiểm tra lại quyền IAM hoặc API Services)")
                    .intent("fallback")
                    .confidence(1.0)
                    .isFallback(false)
                    .quickReplies(List.of())
                    .build();
        }
    }

    // ── Tự fetch productLinks dựa trên intent (bypass Dialogflow payload relay) ─────────────
    private List<MessageMetadata.ProductLink> fetchProductLinksForIntent(
            String intentName, String queryText, Map<String, Object> parameters) {

        List<MessageMetadata.ProductLink> links = new ArrayList<>();
        if (intentName == null) return links;

        try {
            if ("product_detail".equals(intentName)) {
                // Tìm theo kích thước
                String size = safeStr(parameters, "size");
                if (size.isBlank() && queryText != null) {
                    size = extractSizeFromText(queryText);
                }
                if (!size.isBlank()) {
                    log.info("[DialogflowService] Tìm productLinks by size: '{}'", size);
                    links = fetchProductLinksBySize(size);
                }

            } else if ("search_product".equals(intentName)) {
                // Tìm theo keyword
                String keyword = extractKeyword(queryText);
                String brand       = safeStr(parameters, "brand");
                String mattressType = safeStr(parameters, "mattress_type");
                String productType = safeStr(parameters, "product_type");
                String entityQuery = (brand + " " + (mattressType.isBlank() ? productType : mattressType)).trim();

                if (keyword.isBlank()) {
                    keyword = entityQuery;
                }
                if (!keyword.isBlank() && !isStopWordOnly(keyword)) {
                    log.info("[DialogflowService] Tìm productLinks by keyword: '{}'", keyword);
                    links = fetchProductLinksByKeyword(keyword);
                    
                    // FALLBACK: Nếu list button rỗng, mà ta có Entity khác với từ khóa -> Tìm lại bằng Entity (Đồng bộ với WebhookController)
                    if ((links == null || links.isEmpty()) && !entityQuery.isBlank() && !entityQuery.equalsIgnoreCase(keyword)) {
                        log.info("[DialogflowService] Fallback productLinks by entity: '{}'", entityQuery);
                        links = fetchProductLinksByKeyword(entityQuery);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("[DialogflowService] Lỗi fetch productLinks: {}", e.getMessage());
        }
        return links;
    }

    // ── Gọi product-service: tìm theo kích thước ─────────────────────────────
    private List<MessageMetadata.ProductLink> fetchProductLinksBySize(String size) {
        List<MessageMetadata.ProductLink> links = new ArrayList<>();
        try {
            String url = "http://product-service/api/products/all";
            ResponseEntity<java.util.List> response = lbRestTemplate.getForEntity(url, java.util.List.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) return links;

            List<Map<String, Object>> products = response.getBody();
            String normalizedInput = normalizeSize(size);
            String targetWidth     = extractWidth(normalizedInput);
            log.info("[DialogflowService] Lọc size: input='{}' → width='{}'", size, targetWidth);

            for (Map<String, Object> p : products) {
                Object variantsObj = p.get("variants");
                if (!(variantsObj instanceof List)) continue;
                List<Map<String, Object>> variants = (List<Map<String, Object>>) variantsObj;
                for (Map<String, Object> v : variants) {
                    String vSize = (String) v.get("size");
                    if (vSize != null && extractWidth(normalizeSize(vSize)).equals(targetWidth)) {
                        links.add(toProductLink(p));
                        break;
                    }
                }
                if (links.size() >= 4) break;   // tối đa 4 nút
            }
        } catch (Exception e) {
            log.warn("[DialogflowService] fetchProductLinksBySize lỗi: {}", e.getMessage());
        }
        return links;
    }

    // ── Gọi product-service: tìm theo keyword ────────────────────────────────
    private List<MessageMetadata.ProductLink> fetchProductLinksByKeyword(String keyword) {
        List<MessageMetadata.ProductLink> links = new ArrayList<>();
        try {
            // FIX DOUBLE-ENCODING: Dùng Spring's URI variables thay vì tự encode
            String url = "http://product-service/api/products/search?q={keyword}";
            ResponseEntity<java.util.List> response = lbRestTemplate.getForEntity(url, java.util.List.class, keyword);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) return links;

            List<Map<String, Object>> products = response.getBody();
            int limit = Math.min(products.size(), 4);
            for (int i = 0; i < limit; i++) {
                links.add(toProductLink(products.get(i)));
            }
        } catch (Exception e) {
            log.warn("[DialogflowService] fetchProductLinksByKeyword lỗi: {}", e.getMessage());
        }
        return links;
    }

    // ── Chuyển product map → ProductLink entity ───────────────────────────────
    // Product entity không có field slug → dùng id để tạo link /product/:id
    private MessageMetadata.ProductLink toProductLink(Map<String, Object> p) {
        String name = p.get("name") != null ? p.get("name").toString() : "";
        String productId = p.get("id") != null ? p.get("id").toString() : "";
        Number price = p.get("price") instanceof Number ? (Number) p.get("price") : null;
        return MessageMetadata.ProductLink.builder()
                .name(name)
                .slug(productId)   // lưu id vào field slug để frontend tạo URL /product/:id
                .price(price != null ? price.longValue() : 0L)
                .build();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helper methods (mirror from DialogflowWebhookController)
    // ──────────────────────────────────────────────────────────────────────────

    private String safeStr(Map<String, Object> params, String key) {
        if (params == null) return "";
        Object val = params.get(key);
        if (val == null) return "";
        String s = val.toString().trim();
        return "null".equalsIgnoreCase(s) ? "" : s;
    }

    private boolean isStopWordOnly(String query) {
        java.util.Set<String> stopWords = java.util.Set.of(
                "tôi", "mình", "bạn", "shop", "cho", "có", "bán", "không",
                "tìm", "xem", "hàng", "sản", "phẩm", "danh", "sách", "null", "");
        String[] words = query.toLowerCase().split("\\s+");
        for (String w : words) {
            if (!stopWords.contains(w)) return false;
        }
        return true;
    }

    private String extractKeyword(String queryText) {
        if (queryText == null || queryText.isBlank()) return "";
        String cleaned = queryText
                .replaceAll("(?i)tìm (cho)?\\s*(tôi|mình)?\\s*", "")
                .replaceAll("(?i)shop (ơi\\s*)?(có bán)?\\s*", "")
                .replaceAll("(?i)cho (tôi|mình) xem\\s*", "")
                .replaceAll("(?i)(có bán|bán)\\s*", "")
                .replaceAll("(?i)hỏi\\s*", "")
                .replaceAll("(?i)\\s+không[?]?$", "")
                .trim();
        // Giữ nguyên chữ nệm/đệm (đồng bộ với WebhookController) để tìm chính xác loại sản phẩm
        // cleaned = cleaned.replaceAll("(?i)^(nệm|đệm|gối|chăn|ga|topper|bộ|bảo vệ|neem)\\s+", "").trim();
        return cleaned;
    }

    private String extractSizeFromText(String text) {
        if (text == null) return "";
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("(\\d+x\\d+|\\d[,.]?\\d*m\\d*(?:\\s*x\\s*\\d[,.]?\\d*m)?|1m[248]|1m6)",
                        java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(text);
        return m.find() ? m.group(1).replaceAll("\\s+", "") : "";
    }

    private String normalizeSize(String size) {
        if (size == null) return "";
        String s = size.toLowerCase()
                .replaceAll("\\s+", "")
                .replace("cm", "")
                .replace("kingsize", "220");
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
             .replace("2m", "200");
        return s;
    }

    private String extractWidth(String normalizedSize) {
        if (normalizedSize.contains("x")) {
            return normalizedSize.split("x")[0];
        }
        return normalizedSize;
    }
}
