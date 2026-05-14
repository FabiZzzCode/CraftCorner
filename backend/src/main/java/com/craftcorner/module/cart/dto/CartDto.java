package com.craftcorner.module.cart.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartDto {
    private Long id;
    private Long buyerId;
    private List<CartItemDto> items;
    private BigDecimal subtotal;
    private BigDecimal deliveryCharge;
    private BigDecimal total;
    private int itemCount;
}
