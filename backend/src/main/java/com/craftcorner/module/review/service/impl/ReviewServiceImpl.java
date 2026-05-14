package com.craftcorner.module.review.service.impl;

import com.craftcorner.common.exception.BusinessException;
import com.craftcorner.common.exception.ResourceNotFoundException;
import com.craftcorner.common.exception.UnauthorizedException;
import com.craftcorner.module.order.repository.OrderRepository;
import com.craftcorner.module.product.entity.Product;
import com.craftcorner.module.product.repository.ProductRepository;
import com.craftcorner.module.review.dto.ReviewDto;
import com.craftcorner.module.review.dto.ReviewRequest;
import com.craftcorner.module.review.entity.Review;
import com.craftcorner.module.review.repository.ReviewRepository;
import com.craftcorner.module.review.service.ReviewService;
import com.craftcorner.module.user.entity.User;
import com.craftcorner.module.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    @Override
    @Transactional
    public ReviewDto addReview(String buyerEmail, ReviewRequest request) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        if (reviewRepository.existsByProductIdAndBuyerId(product.getId(), buyer.getId())) {
            throw new BusinessException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .product(product)
                .buyer(buyer)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                .build();

        reviewRepository.save(review);
        updateProductRating(product);
        return toDto(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDto> getProductReviews(Long productId, Pageable pageable) {
        return reviewRepository.findByProductId(productId, pageable).map(this::toDto);
    }

    @Override
    @Transactional
    public void deleteReview(Long id, String userEmail) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", id));
        User user = userService.getEntityByEmail(userEmail);

        boolean isOwner = review.getBuyer().getId().equals(user.getId());
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) throw new UnauthorizedException();

        reviewRepository.delete(review);
        updateProductRating(review.getProduct());
    }

    private void updateProductRating(Product product) {
        Double avg = reviewRepository.getAverageRatingByProductId(product.getId());
        long count = reviewRepository.countByProductId(product.getId());
        product.setAverageRating(avg != null
                ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO);
        product.setReviewCount((int) count);
        productRepository.save(product);
    }

    private ReviewDto toDto(Review r) {
        return ReviewDto.builder()
                .id(r.getId())
                .productId(r.getProduct().getId())
                .buyerId(r.getBuyer().getId())
                .buyerName(r.getBuyer().getFullName())
                .buyerImage(r.getBuyer().getProfileImage())
                .rating(r.getRating())
                .title(r.getTitle())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
