package com.b2204925.userservice.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class CreateClerkUserRequest {

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String username;
    private String phone;
    private String gender;
    private List<String> roles;
    private String membership;
}
