package com.craftcorner.module.order.dto;

import com.craftcorner.module.order.enums.OrderStatus;
import com.craftcorner.module.order.enums.PaymentMethod;
import com.craftcorner.module.order.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDto {
    private Long id;
    private String orderNumber;
    private Long buyerId;
    private String buyerName;
    private List<OrderItemDto> items;
    private BigDecimal subtotal;
    private BigDecimal deliveryCharge;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private String notes;
    private AddressDto shippingAddress;
    private LocalDateTime createdAt;
}
