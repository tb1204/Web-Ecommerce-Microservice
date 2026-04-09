package com.b2204925.userservice.controller;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/sliders")
@CrossOrigin(origins = "*")
@Slf4j
public class SliderController {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private final RestTemplate restTemplate;

    // ⚠️ PHẢI dùng explicit constructor — @RequiredArgsConstructor của Lombok
    // KHÔNG propagate @Qualifier vào constructor parameter, dẫn đến Spring
    // inject nhầm @LoadBalanced RestTemplate (tên "restTemplate") thay vì "simpleRestTemplate".
    // Bean @LoadBalanced cố resolve "api.cloudinary.com" qua Eureka → 500 error!
    public SliderController(@Qualifier("simpleRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


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

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    searchUrl, new HttpEntity<>(body, headers), String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            log.error("Error calling Cloudinary search for flashsale banner: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // POST /api/admin/sliders/sign
    @PostMapping("/sign")
    public ResponseEntity<Map<String, Object>> getSignature(@RequestBody Map<String, String> body) {
        String folder = body.getOrDefault("folder", "slider");
        String title = body.get("title");
        long timestamp = System.currentTimeMillis() / 1000;

        Map<String, String> params = new HashMap<>();
        params.put("timestamp", String.valueOf(timestamp));
        params.put("folder", folder);
        if (StringUtils.isNotBlank(title)) {
            params.put("context", "title=" + title);
        }
        String toSign = params.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));
        String signature = DigestUtils.sha1Hex(toSign + apiSecret);
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", timestamp);
        response.put("signature", signature);
        response.put("cloudName", cloudName);
        response.put("apiKey", apiKey);
        response.put("folder", folder);
        if (StringUtils.isNotBlank(title)) {
            response.put("context", "title=" + title);
        }
        return ResponseEntity.ok(response);
    }

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

        try {
            ResponseEntity<String> res = restTemplate.postForEntity(
                    searchUrl, new HttpEntity<>(body, headers), String.class);
            return ResponseEntity.status(res.getStatusCode()).body(res.getBody());
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("Cloudinary API Client Error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Error listing images from Cloudinary: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
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
