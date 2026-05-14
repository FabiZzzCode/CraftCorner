package com.craftcorner.module.cart.controller;

import com.craftcorner.common.response.ApiResponse;
import com.craftcorner.module.cart.dto.CartDto;
import com.craftcorner.module.cart.dto.CartItemRequest;
import com.craftcorner.module.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDto>> addItem(@AuthenticationPrincipal UserDetails userDetails,
                                                         @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                cartService.addItem(userDetails.getUsername(), request), "Item added to cart"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(userDetails.getUsername())));
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<ApiResponse<CartDto>> updateItem(@AuthenticationPrincipal UserDetails userDetails,
                                                            @PathVariable Long cartItemId,
                                                            @RequestParam Integer quantity) {
        return ResponseEntity.ok(ApiResponse.success(
                cartService.updateItem(userDetails.getUsername(), cartItemId, quantity)));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ApiResponse<CartDto>> removeItem(@AuthenticationPrincipal UserDetails userDetails,
                                                            @PathVariable Long cartItemId) {
        return ResponseEntity.ok(ApiResponse.success(
                cartService.removeItem(userDetails.getUsername(), cartItemId), "Item removed"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared"));
    }
}
