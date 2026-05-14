package com.craftcorner.module.shop.service;

import com.craftcorner.module.shop.dto.ShopDto;
import com.craftcorner.module.shop.dto.ShopRequest;
import com.craftcorner.module.shop.entity.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ShopService {
    ShopDto createShop(String sellerEmail, ShopRequest request);
    ShopDto getShopById(Long id);
    ShopDto getMyShop(String sellerEmail);
    ShopDto updateShop(Long id, String sellerEmail, ShopRequest request);
    Page<ShopDto> getAllShops(Pageable pageable);
    ShopDto approveShop(Long id);
    ShopDto rejectShop(Long id);
    void deleteShop(Long id);
    Shop getApprovedShopBySellerEmail(String email);
}
