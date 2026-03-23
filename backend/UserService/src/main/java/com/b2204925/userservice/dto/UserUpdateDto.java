// package com.b2204925.userservice.dto;
// import jakarta.validation.constraints.Size;
// import lombok.Data;
// @Data
// public class UserUpdateDto {
//     @Size(max = 50)
//     private String firstName;
//     @Size(max = 100)
//     private String lastName;
//     @Size(max = 20)
//     private String phone;
//     private String gender;
//     private String avatarUrl;
//     private String email;
//     private String username;
// }
package com.b2204925.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserUpdateDto {

    @Size(max = 50, message = "Tên không được dài quá 50 ký tự")
    private String firstName;

    @Size(max = 100, message = "Họ không được dài quá 100 ký tự")
    private String lastName;

    @Size(max = 20, message = "Số điện thoại không được dài quá 20 ký tự")
    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @Pattern(regexp = "^(male|female|other)$", message = "Giới tính phải là male, female hoặc other")
    private String gender;

    @Size(max = 500, message = "URL avatar quá dài")
    @Pattern(regexp = "^(https?://.*\\.(jpg|jpeg|png|gif|webp)|)$",
            message = "URL avatar phải là link ảnh hợp lệ hoặc để trống")
    private String avatarUrl;

    // Nếu cho phép update email/username thì thêm validation chặt hơn
    @Email(message = "Email không hợp lệ")
    private String email;

    @Size(min = 5, max = 30, message = "Username từ 3-30 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.]+$", message = "Username chỉ chứa chữ, số, gạch dưới, chấm")
    private String username;
}
