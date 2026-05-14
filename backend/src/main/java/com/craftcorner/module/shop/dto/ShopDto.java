package com.craftcorner.module.shop.dto;

import com.craftcorner.module.shop.enums.ShopStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ShopDto {
    private Long id;
    private Long sellerId;
    private String sellerName;
    private String name;
    private String description;
    private String logoUrl;
    private String bannerUrl;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private ShopStatus status;
    private LocalDateTime createdAt;
}
