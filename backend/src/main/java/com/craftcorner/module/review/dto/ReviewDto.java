package com.craftcorner.module.review.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewDto {
    private Long id;
    private Long productId;
    private Long buyerId;
    private String buyerName;
    private String buyerImage;
    private Integer rating;
    private String title;
    private String comment;
    private LocalDateTime createdAt;
}
