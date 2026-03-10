package com.b2204925.apigateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


    @RestController
    public class HomeController {
        @GetMapping("/home")
        public String home() {
            return "Welcome to API Gateway! Use /api/users, /api/orders, etc.";
        }
    }

