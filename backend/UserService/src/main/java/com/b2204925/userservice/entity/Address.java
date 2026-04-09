package com.b2204925.userservice.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Address {

    private String id; // UUID để frontend identify địa chỉ
    private String receiverName;
    private String phone;
    private String street;
    private String ward;
    private String district;
    private String province;

    @JsonProperty("isDefault")
    private boolean defaultAddress;
}
