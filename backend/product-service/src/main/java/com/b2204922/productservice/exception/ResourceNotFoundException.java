package com.b2204922.productservice.exception;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
public class ResourceNotFoundException {
    public ResourceNotFoundException(String message) {
        super();
    }
}
