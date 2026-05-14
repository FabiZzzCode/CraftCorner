package com.craftcorner.module.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressDto {
    private Long id;
    @NotBlank private String fullName;
    @NotBlank private String phone;
    @NotBlank private String addressLine1;
    private String addressLine2;
    @NotBlank private String city;
    private String state;
    private String postalCode;
    private String country;
    private boolean isDefault;
}
