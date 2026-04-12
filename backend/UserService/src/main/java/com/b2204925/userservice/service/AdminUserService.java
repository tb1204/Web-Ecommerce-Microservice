package com.b2204925.userservice.service;

import com.b2204925.userservice.dto.AdminUserUpdateDto;
import com.b2204925.userservice.dto.CreateClerkUserRequest;
import com.b2204925.userservice.entity.Membership;
import com.b2204925.userservice.entity.User;
import com.b2204925.userservice.exception.AppException;
import com.b2204925.userservice.exception.ErrorCode;
import com.b2204925.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserService userService;
    private final ClerkService clerkService;
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    public User getUserByClerkId(String clerkId) {
        return userService.getUserOrThrow(clerkId);
    }

    public String createClerkUser(CreateClerkUserRequest request) {
        return clerkService.createUser(request);
    }

    public User createUser(AdminUserUpdateDto dto) {
        if (dto.getClerkId() == null || dto.getClerkId().isBlank()) {
            throw new AppException(ErrorCode.CLERK_ID_REQUIRED);
        }
        if (userRepository.existsByClerkId(dto.getClerkId())) {
            throw new AppException(ErrorCode.CLERK_ID_ALREADY_EXISTS);
        }
        if (dto.getEmail() != null && userRepository.existsByEmail(dto.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = buildUserFromDto(dto);
        user.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        user.setIsBlocked(false);

        User saved = userService.createUser(user);

        String role = dto.getRoles() != null && dto.getRoles().contains("ADMIN") ? "admin" : "user";
        clerkService.updatePublicMetadata(saved.getClerkId(), role);

        return saved;
    }

    public User updateUser(String clerkId, AdminUserUpdateDto dto) {
        System.out.println("📦 DTO nhận được: membership=" + dto.getMembership());
        System.out.println("📦 DTO nhận được: roles=" + dto.getRoles());
        User user = userService.getUserOrThrow(clerkId);

        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
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
        // Trong AdminUserService.updateUser(), sau dòng xử lý avatarUrl:
if (dto.getUsername() != null) {
    user.setUsername(dto.getUsername());
}

        if (dto.getRoles() != null) {
            user.setRoles(dto.getRoles());
            String role = dto.getRoles().contains("ADMIN") ? "admin" : "user";
            clerkService.updatePublicMetadata(clerkId, role);
        }

        if (dto.getMembership() != null) {
            user.setMembership(Membership.valueOf(dto.getMembership().toUpperCase()));
        }

        // Đồng bộ ban/unban Clerk nếu isActive thay đổi
        if (dto.getIsActive() != null && !dto.getIsActive().equals(user.getIsActive())) {
            if (dto.getIsActive()) {
                clerkService.unbanUser(clerkId);
            } else {
                clerkService.banUser(clerkId);
            }
            user.setIsActive(dto.getIsActive());
        }

        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    public void banUser(String clerkId) {
        clerkService.banUser(clerkId);
        userService.banUser(clerkId);
    }

    public void unbanUser(String clerkId) {
        clerkService.unbanUser(clerkId);
        userService.unbanUser(clerkId);
    }

    public void lockUser(String clerkId) {
        clerkService.lockUser(clerkId);
        userService.lockUser(clerkId);
    }

    public void unlockUser(String clerkId) {
        clerkService.unlockUser(clerkId);
        userService.unlockUser(clerkId);
    }

    public void deleteUser(String clerkId) {
        userService.getUserOrThrow(clerkId); // validate tồn tại
        clerkService.deleteUser(clerkId);
        userService.deleteUser(clerkId);
    }

    // ─── Helper ───────────────────────────────────────────────────────────────
    private User buildUserFromDto(AdminUserUpdateDto dto) {
        User user = new User();
        user.setClerkId(dto.getClerkId());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender());
        user.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            user.setRoles(dto.getRoles());
        }
        if (dto.getMembership() != null) {
            user.setMembership(Membership.valueOf(dto.getMembership().toUpperCase()));
        }
        return user;
    }
}
