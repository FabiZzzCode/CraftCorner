package com.craftcorner.module.wishlist.service;

import com.craftcorner.module.product.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WishlistService {
    void addToWishlist(String buyerEmail, Long productId);
    Page<ProductDto> getWishlist(String buyerEmail, Pageable pageable);
    void removeFromWishlist(String buyerEmail, Long productId);
    boolean isInWishlist(String buyerEmail, Long productId);
}
