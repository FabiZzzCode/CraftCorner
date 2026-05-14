package com.craftcorner.module.wishlist.controller;

import com.craftcorner.common.response.ApiResponse;
import com.craftcorner.common.response.PageResponse;
import com.craftcorner.module.product.dto.ProductDto;
import com.craftcorner.module.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Void>> add(@AuthenticationPrincipal UserDetails userDetails,
                                                  @RequestParam Long productId) {
        wishlistService.addToWishlist(userDetails.getUsername(), productId);
        return ResponseEntity.ok(ApiResponse.success("Added to wishlist"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductDto>>> getWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                PageResponse.of(wishlistService.getWishlist(userDetails.getUsername(), PageRequest.of(page, size)))));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<Void>> remove(@AuthenticationPrincipal UserDetails userDetails,
                                                     @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userDetails.getUsername(), productId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist"));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> check(@AuthenticationPrincipal UserDetails userDetails,
                                                       @PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(
                wishlistService.isInWishlist(userDetails.getUsername(), productId)));
    }
}
