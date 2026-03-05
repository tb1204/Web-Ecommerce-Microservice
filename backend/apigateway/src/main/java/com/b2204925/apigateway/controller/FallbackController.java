package com.b2204925.apigateway.controller;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/{service}")
    public ResponseEntity<Map<String, String>> fallback(@PathVariable String service) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Dịch vụ " + service + " đang tạm thời không khả dụng. Vui lòng thử lại sau.");
        response.put("service", service);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}