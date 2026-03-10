//package com.b2204925.userservice.controller;
//
//public class SliderController {
//}
package com.b2204925.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/sliders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SliderController {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private final RestTemplate restTemplate;

    // GET /api/admin/sliders/banners/flashsale
    @GetMapping("/banners/flashsale")
    public ResponseEntity<String> getLatestFlashsaleBanner() {
        String searchUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/resources/search";

        Map<String, Object> body = new HashMap<>();
        body.put("expression", "folder:flashsale AND resource_type:image");
        body.put("max_results", 1);
        body.put("sort_by", List.of(Map.of("created_at", "desc")));
        body.put("with_field", List.of("context", "metadata"));

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(apiKey, apiSecret);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<String> response = restTemplate.postForEntity(
                searchUrl, new HttpEntity<>(body, headers), String.class);

        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    // POST /api/admin/sliders/sign
    @PostMapping("/sign")
    public ResponseEntity<Map<String, Object>> getSignature(@RequestBody Map<String, String> body) {
        String folder = body.getOrDefault("folder", "slider");
        String title = body.get("title");
        long timestamp = System.currentTimeMillis() / 1000;

        // === PHẦN MỚI: Sinh public_id unique ===
        // Quy tắc: folder/[slug-title hoặc banner]-[timestamp]-[random 6 ký tự]
        String baseName;
        if (StringUtils.isNotBlank(title)) {
            baseName = title.trim()
                    .toLowerCase()
                    .replaceAll("[^a-z0-9\\s-]", "") // loại ký tự lạ
                    .replaceAll("\\s+", "-");           // khoảng trắng → -
        } else {
            baseName = "banner";  // mặc định nếu không có title
        }

        // Thêm timestamp + random ngắn để đảm bảo unique
        String randomSuffix = UUID.randomUUID().toString().substring(0, 8); // 8 ký tự random
        String publicId = folder + "/" + baseName + "-" + timestamp + "-" + randomSuffix;

        // === Tính params để ký (giữ nguyên) ===
        Map<String, String> params = new HashMap<>();
        params.put("timestamp", String.valueOf(timestamp));
        params.put("folder", folder);
        if (StringUtils.isNotBlank(title)) {
            params.put("context", "title=" + title);
        }

        // Thêm public_id vào params để tính chữ ký (Cloudinary yêu cầu nếu dùng public_id)
        params.put("public_id", publicId);

        String toSign = params.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));

        String signature = DigestUtils.sha1Hex(toSign + apiSecret);

        // === Response trả về thêm publicId ===
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", timestamp);
        response.put("signature", signature);
        response.put("cloudName", cloudName);
        response.put("apiKey", apiKey);
        response.put("folder", folder);
        response.put("publicId", publicId);               // <-- MỚI: trả public_id cho frontend
        if (StringUtils.isNotBlank(title)) {
            response.put("context", "title=" + title);
        }

        return ResponseEntity.ok(response);
    }
    // @PostMapping("/sign")
    // public ResponseEntity<Map<String, Object>> getSignature(@RequestBody Map<String, String> body) {
    //     String folder = body.getOrDefault("folder", "slider");
    //     String title = body.get("title");
    //     long timestamp = System.currentTimeMillis() / 1000;

    //     Map<String, String> params = new HashMap<>();
    //     params.put("timestamp", String.valueOf(timestamp));
    //     params.put("folder", folder);
    //     if (StringUtils.isNotBlank(title)) params.put("context", "title=" + title);
    //     String toSign = params.entrySet().stream()
    //             .sorted(Map.Entry.comparingByKey())
    //             .map(e -> e.getKey() + "=" + e.getValue())
    //             .collect(Collectors.joining("&"));
    //     String signature = DigestUtils.sha1Hex(toSign + apiSecret);
    //     Map<String, Object> response = new HashMap<>();
    //     response.put("timestamp", timestamp);
    //     response.put("signature", signature);
    //     response.put("cloudName", cloudName);
    //     response.put("apiKey", apiKey);
    //     response.put("folder", folder);
    //     if (StringUtils.isNotBlank(title)) response.put("context", "title=" + title);
    //     return ResponseEntity.ok(response);
    // }
    // GET /api/admin/sliders/list?folder=slider&max=20
    @GetMapping("/list")
    public ResponseEntity<?> listImages(
            @RequestParam(defaultValue = "slider") String folder,
            @RequestParam(defaultValue = "20") int max) {

        String searchUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/resources/search";

        Map<String, Object> body = new HashMap<>();
        body.put("expression", "folder:" + folder + " AND resource_type:image");
        body.put("max_results", Math.min(max, 100));
        body.put("sort_by", List.of(Map.of("created_at", "asc")));
        body.put("with_field", List.of("context", "metadata"));

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(apiKey, apiSecret);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<String> res = restTemplate.postForEntity(
                searchUrl, new HttpEntity<>(body, headers), String.class);

        return ResponseEntity.status(res.getStatusCode()).body(res.getBody());
    }

    // DELETE /api/admin/sliders/delete
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteImage(@RequestBody Map<String, String> body) {
        String publicId = body.get("publicId");
        if (publicId == null || publicId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "publicId is required"));
        }

        long timestamp = System.currentTimeMillis() / 1000;
        String paramsToSign = "public_id=" + publicId + "&timestamp=" + timestamp;
        String signature = DigestUtils.sha1Hex(paramsToSign + apiSecret);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("public_id", publicId);
        form.add("timestamp", String.valueOf(timestamp));
        form.add("api_key", apiKey);
        form.add("signature", signature);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.cloudinary.com/v1_1/" + cloudName + "/image/destroy",
                new HttpEntity<>(form, headers),
                String.class
        );

        return ResponseEntity.ok(response.getBody());
    }
}
