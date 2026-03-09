package com.b2204925.userservice.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Address {

    private String receiverName;
    private String phone;
    private String street;
    private String ward;
    private String district; //cho null
    private String province;
    @JsonProperty("isDefault")
    private boolean defaultAddress;
}
