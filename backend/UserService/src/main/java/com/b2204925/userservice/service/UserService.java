package com.b2204925.userservice.service;

import com.b2204925.userservice.dto.UserUpdateDto;
import com.b2204925.userservice.entity.User;
import com.b2204925.userservice.exception.AppException;
import com.b2204925.userservice.exception.ErrorCode;
import com.b2204925.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // ─── Queries ──────────────────────────────────────────────────────────────
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserProfile(String clerkId) {
        return userRepository.findByClerkId(clerkId);
    }

    public User getUserOrThrow(String clerkId) {
        return userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    // ─── Create ───────────────────────────────────────────────────────────────
    public User createUser(User user) {
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    /**
     * Lấy user hiện tại từ JWT. Nếu chưa tồn tại (webhook chưa kịp sync) thì
     * tạo mới.
     */
    public User getOrCreateCurrentUser(Jwt jwt) {
        String clerkId = jwt.getSubject();
        return getUserProfile(clerkId).orElseGet(() -> {
            User newUser = User.builder()
                    .clerkId(clerkId)
                    .email(jwt.getClaimAsString("email"))
                    .firstName(jwt.getClaimAsString("first_name"))
                    .lastName(jwt.getClaimAsString("last_name"))
                    .roles(List.of("USER"))
                    .isActive(true)
                    .isBlocked(false)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            return userRepository.save(newUser);
        });
    }

    // ─── Update profile (user tự cập nhật) ───────────────────────────────────
    public User updateUserProfile(String clerkId, UserUpdateDto dto) {
        User user = getUserOrThrow(clerkId);
        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
        }
        if (dto.getGender() != null) {
            user.setGender(dto.getGender());
        }
        if (dto.getAvatarUrl() != null) {
            user.setAvatarUrl(dto.getAvatarUrl());
        }
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    // ─── Delete ───────────────────────────────────────────────────────────────
    public void deleteUser(String clerkId) {
        userRepository.deleteByClerkId(clerkId);
    }

    // ─── Ban / Unban (isActive) ───────────────────────────────────────────────
    public void banUser(String clerkId) {
        User user = getUserOrThrow(clerkId);
        user.setIsActive(false);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    public void unbanUser(String clerkId) {
        User user = getUserOrThrow(clerkId);
        user.setIsActive(true);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    // ─── Lock / Unlock (isBlocked) ────────────────────────────────────────────
    public void lockUser(String clerkId) {
        User user = getUserOrThrow(clerkId);
        user.setIsBlocked(true);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    public void unlockUser(String clerkId) {
        User user = getUserOrThrow(clerkId);
        user.setIsBlocked(false);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }
}
