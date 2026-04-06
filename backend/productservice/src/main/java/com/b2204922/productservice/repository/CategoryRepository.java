package com.b2204922.productservice.repository;

import com.b2204922.productservice.entity.Category;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
}
