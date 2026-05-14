package com.craftcorner.module.order.dto;

import com.craftcorner.module.order.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {
    @NotNull
    private Long shippingAddressId;

    private PaymentMethod paymentMethod = PaymentMethod.CASH_ON_DELIVERY;

    private String notes;
}
