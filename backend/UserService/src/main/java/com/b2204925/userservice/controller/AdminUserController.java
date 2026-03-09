package com.b2204925.userservice.controller;

import com.b2204925.userservice.dto.AdminUserUpdateDto;
import com.b2204925.userservice.dto.CreateClerkUserRequest;
import com.b2204925.userservice.entity.User;
import com.b2204925.userservice.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserController.class);

    private final AdminUserService adminUserService;

    // GET /api/admin/users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    // GET /api/admin/users/{clerkId}
    @GetMapping("/{clerkId}")
    public ResponseEntity<User> getUserByClerkId(@PathVariable String clerkId) {
        return ResponseEntity.ok(adminUserService.getUserByClerkId(clerkId));
    }

    // POST /api/admin/users/create-clerk-user
    @PostMapping("/create-clerk-user")
    public ResponseEntity<Map<String, Object>> createClerkUser(@RequestBody CreateClerkUserRequest request) {
        String clerkId = adminUserService.createClerkUser(request);
        return ResponseEntity.ok(Map.of(
                "clerkId", clerkId,
                "message", "Tạo tài khoản Clerk thành công"
        ));
    }

    // PATCH /api/admin/users/{clerkId}
    @PatchMapping("/{clerkId}")
    public ResponseEntity<User> updateUser(
            @PathVariable String clerkId,
            @RequestBody AdminUserUpdateDto dto) {
        return ResponseEntity.ok(adminUserService.updateUser(clerkId, dto));
    }

    // PATCH /api/admin/users/{clerkId}/ban
    @PatchMapping("/{clerkId}/ban")
    public ResponseEntity<Void> banUser(@PathVariable String clerkId) {
        adminUserService.banUser(clerkId);
        logger.info("Banned user: {}", clerkId);
        return ResponseEntity.ok().build();
    }

    // PATCH /api/admin/users/{clerkId}/unban
    @PatchMapping("/{clerkId}/unban")
    public ResponseEntity<Void> unbanUser(@PathVariable String clerkId) {
        adminUserService.unbanUser(clerkId);
        logger.info("Unbanned user: {}", clerkId);
        return ResponseEntity.ok().build();
    }

    // PATCH /api/admin/users/{clerkId}/lock
    @PatchMapping("/{clerkId}/lock")
    public ResponseEntity<Void> lockUser(@PathVariable String clerkId) {
        adminUserService.lockUser(clerkId);
        logger.info("Locked user: {}", clerkId);
        return ResponseEntity.ok().build();
    }

    // PATCH /api/admin/users/{clerkId}/unlock
    @PatchMapping("/{clerkId}/unlock")
    public ResponseEntity<Void> unlockUser(@PathVariable String clerkId) {
        adminUserService.unlockUser(clerkId);
        logger.info("Unlocked user: {}", clerkId);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/admin/users/{clerkId}
    @DeleteMapping("/{clerkId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String clerkId) {
        adminUserService.deleteUser(clerkId);
        logger.info("Deleted user: {}", clerkId);
        return ResponseEntity.noContent().build();
    }
    // POST /api/admin/users

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody AdminUserUpdateDto dto) {
        User saved = adminUserService.createUser(dto);
        logger.info("Admin created user: {}", saved.getClerkId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
