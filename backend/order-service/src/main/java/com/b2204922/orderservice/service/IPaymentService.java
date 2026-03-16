package com.b2204922.orderservice.service;

public interface IPaymentService {
    boolean refund(String transactionId, Double amount);
}
