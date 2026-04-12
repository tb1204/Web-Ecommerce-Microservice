package com.b2204925.userservice.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDto {

    @Size(max = 50)
    private String firstName;

    @Size(max = 100)
    private String lastName;

    @Size(max = 20)
    private String phone;

    private String gender;

    private String avatarUrl;
    private String email;
    @Size(max = 50)
    private String username;
}
