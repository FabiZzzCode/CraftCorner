package com.craftcorner.module.cart.service;

import com.craftcorner.module.cart.dto.CartDto;
import com.craftcorner.module.cart.dto.CartItemRequest;

public interface CartService {
    CartDto addItem(String buyerEmail, CartItemRequest request);
    CartDto getCart(String buyerEmail);
    CartDto updateItem(String buyerEmail, Long cartItemId, Integer quantity);
    CartDto removeItem(String buyerEmail, Long cartItemId);
    void clearCart(String buyerEmail);
}
