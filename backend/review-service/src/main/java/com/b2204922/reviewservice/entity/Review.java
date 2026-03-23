package com.b2204922.reviewservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "reviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    private String id;

    private String productId;
    private String userId;
    private String username;
    private Integer rating;
    private String comment;
    private List<String> images;
    private AdminReply adminReply;
    private String status; //approved, pending, rejected
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
