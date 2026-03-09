// //package com.b2204925.userservice.controller;
// //
// //public class UserController {
// //}
// package com.b2204925.userservice.controller;
// import com.b2204925.userservice.dto.UserUpdateDto;
// import com.b2204925.userservice.entity.User;
// import com.b2204925.userservice.service.UserService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import org.springframework.security.oauth2.jwt.Jwt;
// import org.springframework.web.bind.annotation.*;
// import java.time.Instant;
// import java.util.List;
// @RestController
// @RequestMapping("/api/users")
// @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
// @RequiredArgsConstructor
// public class UserController {
//     private final UserService userService;
//     // GET /api/users/me
//     @GetMapping("/me")
//     public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
//         String clerkId = jwt.getSubject();
//         return userService.getUserProfile(clerkId)
//                 .map(ResponseEntity::ok)
//                 .orElseGet(() -> {
//                     // Tạo mới nếu webhook chưa kịp sync
//                     User newUser = User.builder()
//                             .clerkId(clerkId)
//                             .email(jwt.getClaimAsString("email"))
//                             .firstName(jwt.getClaimAsString("first_name"))
//                             .lastName(jwt.getClaimAsString("last_name"))
//                             .roles(List.of("USER"))
//                             .isActive(true)
//                             .isBlocked(false)
//                             .createdAt(Instant.now())
//                             .updatedAt(Instant.now())
//                             .build();
//                     return ResponseEntity.ok(userService.createUser(newUser));
//                 });
//     }
//     // PUT /api/users/me
//     @PutMapping("/me")
//     public ResponseEntity<User> updateProfile(
//             @AuthenticationPrincipal Jwt jwt,
//             @RequestBody UserUpdateDto dto) {
//         String clerkId = jwt.getSubject();
//         User updated = User.builder()
//                 .firstName(dto.getFirstName())
//                 .lastName(dto.getLastName())
//                 .phone(dto.getPhone())
//                 .gender(dto.getGender())
//                 .avatarUrl(dto.getAvatarUrl())
//                 .build();
//         return ResponseEntity.ok(userService.updateUserProfile(clerkId, updated));
//     }
//     // POST /api/users/logout
//     @PostMapping("/logout")
//     public ResponseEntity<String> logout() {
//         return ResponseEntity.ok("Logout thành công từ phía client.");
//     }
// }
package com.b2204925.userservice.controller;

import com.b2204925.userservice.dto.UserUpdateDto;
import com.b2204925.userservice.entity.User;
import com.b2204925.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users/me
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(userService.getOrCreateCurrentUser(jwt));
    }

    // PUT /api/users/me
    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UserUpdateDto dto) {
        return ResponseEntity.ok(userService.updateUserProfile(jwt.getSubject(), dto));
    }

    // POST /api/users/logout
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout thành công từ phía client.");
    }
}
