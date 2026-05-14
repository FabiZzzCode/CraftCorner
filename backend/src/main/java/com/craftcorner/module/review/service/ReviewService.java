package com.craftcorner.module.review.service;

import com.craftcorner.module.review.dto.ReviewDto;
import com.craftcorner.module.review.dto.ReviewRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewDto addReview(String buyerEmail, ReviewRequest request);
    Page<ReviewDto> getProductReviews(Long productId, Pageable pageable);
    void deleteReview(Long id, String userEmail);
}
