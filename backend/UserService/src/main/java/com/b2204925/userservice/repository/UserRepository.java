package com.b2204925.userservice.repository;

import com.b2204925.userservice.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByClerkId(String clerkId);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByClerkId(String clerkId);

    void deleteByClerkId(String clerkId);
}
