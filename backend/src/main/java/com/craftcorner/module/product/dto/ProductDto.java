package com.craftcorner.module.product.dto;

import com.craftcorner.module.product.enums.ProductStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductDto {
    private Long id;
    private Long shopId;
    private String shopName;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private BigDecimal effectivePrice;
    private Integer stockQuantity;
    private String material;
    private String productionTime;
    private String deliveryOption;
    private ProductStatus status;
    private BigDecimal averageRating;
    private Integer reviewCount;
    private List<String> imageUrls;
    private String primaryImageUrl;
    private LocalDateTime createdAt;
}
