package com.b2204925.userservice.dto;

import lombok.Data;
import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class UserResponse {

    private String id;
    private String clerkId;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String phone;
    private String gender;
    private String avatarUrl;
    private List<String> roles;
    @JsonProperty("isActive")   // ← THÊM
    private Boolean isActive;

    @JsonProperty("isBlocked")  // ← THÊM

    private Boolean isBlocked;
    private String membership;
    private Instant createdAt;
    private Instant updatedAt;
}
