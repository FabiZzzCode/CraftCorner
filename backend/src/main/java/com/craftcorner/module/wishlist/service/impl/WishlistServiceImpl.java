package com.craftcorner.module.wishlist.service.impl;

import com.craftcorner.common.exception.BusinessException;
import com.craftcorner.common.exception.ResourceNotFoundException;
import com.craftcorner.module.product.dto.ProductDto;
import com.craftcorner.module.product.entity.Product;
import com.craftcorner.module.product.entity.ProductImage;
import com.craftcorner.module.product.repository.ProductRepository;
import com.craftcorner.module.user.entity.User;
import com.craftcorner.module.user.service.UserService;
import com.craftcorner.module.wishlist.entity.Wishlist;
import com.craftcorner.module.wishlist.repository.WishlistRepository;
import com.craftcorner.module.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    @Override
    @Transactional
    public void addToWishlist(String buyerEmail, Long productId) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        if (wishlistRepository.existsByBuyerIdAndProductId(buyer.getId(), productId)) {
            throw new BusinessException("Product already in wishlist");
        }

        wishlistRepository.save(Wishlist.builder().buyer(buyer).product(product).build());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getWishlist(String buyerEmail, Pageable pageable) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        return wishlistRepository.findByBuyerId(buyer.getId(), pageable)
                .map(w -> toProductDto(w.getProduct()));
    }

    @Override
    @Transactional
    public void removeFromWishlist(String buyerEmail, Long productId) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        wishlistRepository.deleteByBuyerIdAndProductId(buyer.getId(), productId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isInWishlist(String buyerEmail, Long productId) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        return wishlistRepository.existsByBuyerIdAndProductId(buyer.getId(), productId);
    }

    private ProductDto toProductDto(Product p) {
        List<String> imageUrls = p.getImages().stream().map(ProductImage::getImageUrl).toList();
        String primary = p.getImages().stream().filter(ProductImage::isPrimary)
                .map(ProductImage::getImageUrl).findFirst().orElse(null);
        return ProductDto.builder()
                .id(p.getId())
                .shopId(p.getShop().getId())
                .shopName(p.getShop().getName())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .name(p.getName())
                .price(p.getPrice())
                .discountPrice(p.getDiscountPrice())
                .effectivePrice(p.getEffectivePrice())
                .stockQuantity(p.getStockQuantity())
                .status(p.getStatus())
                .averageRating(p.getAverageRating())
                .reviewCount(p.getReviewCount())
                .imageUrls(imageUrls)
                .primaryImageUrl(primary)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
