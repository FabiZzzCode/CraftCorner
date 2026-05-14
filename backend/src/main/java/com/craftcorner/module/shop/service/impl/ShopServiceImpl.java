package com.craftcorner.module.shop.service.impl;

import com.craftcorner.common.exception.BusinessException;
import com.craftcorner.common.exception.ResourceNotFoundException;
import com.craftcorner.common.exception.UnauthorizedException;
import com.craftcorner.module.shop.dto.ShopDto;
import com.craftcorner.module.shop.dto.ShopRequest;
import com.craftcorner.module.shop.entity.Shop;
import com.craftcorner.module.shop.enums.ShopStatus;
import com.craftcorner.module.shop.repository.ShopRepository;
import com.craftcorner.module.shop.service.ShopService;
import com.craftcorner.module.user.entity.User;
import com.craftcorner.module.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;
    private final UserService userService;

    @Override
    @Transactional
    public ShopDto createShop(String sellerEmail, ShopRequest request) {
        User seller = userService.getEntityByEmail(sellerEmail);
        if (shopRepository.existsBySellerId(seller.getId())) {
            throw new BusinessException("You already have a shop");
        }
        Shop shop = Shop.builder()
                .seller(seller)
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .bannerUrl(request.getBannerUrl())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .address(request.getAddress())
                .build();
        return toDto(shopRepository.save(shop));
    }

    @Override
    @Transactional(readOnly = true)
    public ShopDto getShopById(Long id) {
        return toDto(findById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public ShopDto getMyShop(String sellerEmail) {
        User seller = userService.getEntityByEmail(sellerEmail);
        return toDto(shopRepository.findBySellerId(seller.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for seller")));
    }

    @Override
    @Transactional
    public ShopDto updateShop(Long id, String sellerEmail, ShopRequest request) {
        Shop shop = findById(id);
        assertOwner(shop, sellerEmail);
        shop.setName(request.getName());
        shop.setDescription(request.getDescription());
        if (request.getLogoUrl() != null) shop.setLogoUrl(request.getLogoUrl());
        if (request.getBannerUrl() != null) shop.setBannerUrl(request.getBannerUrl());
        if (request.getContactEmail() != null) shop.setContactEmail(request.getContactEmail());
        if (request.getContactPhone() != null) shop.setContactPhone(request.getContactPhone());
        if (request.getAddress() != null) shop.setAddress(request.getAddress());
        return toDto(shopRepository.save(shop));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ShopDto> getAllShops(Pageable pageable) {
        return shopRepository.findAll(pageable).map(this::toDto);
    }

    @Override
    @Transactional
    public ShopDto approveShop(Long id) {
        Shop shop = findById(id);
        shop.setStatus(ShopStatus.APPROVED);
        return toDto(shopRepository.save(shop));
    }

    @Override
    @Transactional
    public ShopDto rejectShop(Long id) {
        Shop shop = findById(id);
        shop.setStatus(ShopStatus.REJECTED);
        return toDto(shopRepository.save(shop));
    }

    @Override
    @Transactional
    public void deleteShop(Long id) {
        if (!shopRepository.existsById(id)) throw new ResourceNotFoundException("Shop", id);
        shopRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Shop getApprovedShopBySellerEmail(String email) {
        User seller = userService.getEntityByEmail(email);
        Shop shop = shopRepository.findBySellerId(seller.getId())
                .orElseThrow(() -> new BusinessException("You do not have a shop"));
        if (shop.getStatus() != ShopStatus.APPROVED) {
            throw new BusinessException("Your shop is not approved yet", HttpStatus.FORBIDDEN);
        }
        return shop;
    }

    private Shop findById(Long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", id));
    }

    private void assertOwner(Shop shop, String email) {
        if (!shop.getSeller().getEmail().equals(email)) {
            throw new UnauthorizedException("You do not own this shop");
        }
    }

    private ShopDto toDto(Shop shop) {
        return ShopDto.builder()
                .id(shop.getId())
                .sellerId(shop.getSeller().getId())
                .sellerName(shop.getSeller().getFullName())
                .name(shop.getName())
                .description(shop.getDescription())
                .logoUrl(shop.getLogoUrl())
                .bannerUrl(shop.getBannerUrl())
                .contactEmail(shop.getContactEmail())
                .contactPhone(shop.getContactPhone())
                .address(shop.getAddress())
                .status(shop.getStatus())
                .createdAt(shop.getCreatedAt())
                .build();
    }
}
