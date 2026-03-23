package com.b2204922.reviewservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private String id;
    private String productId;
    private String userId;
    private String username;
    private Integer rating;
    private String comment;
    private List<String> images;

    private String status;

    // Nếu status == "rejected" hoặc "pending" thì hiển thị là đang ẩn
    private boolean isHidden;

    // Admin Reply
    private String adminReplyContent;
    private LocalDateTime adminReplyDate;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
