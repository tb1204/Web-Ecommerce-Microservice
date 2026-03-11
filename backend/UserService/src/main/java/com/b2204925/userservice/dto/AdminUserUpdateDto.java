package com.b2204925.userservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdminUserUpdateDto {

    private String clerkId;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String phone;
    private String gender;
    private String avatarUrl;
    private Boolean isActive;
    private Boolean isBlocked;
    private List<String> roles;
    private String membership;

}
