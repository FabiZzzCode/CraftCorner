package com.craftcorner.module.shop.repository;

import com.craftcorner.module.shop.entity.Shop;
import com.craftcorner.module.shop.enums.ShopStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findBySellerId(Long sellerId);
    boolean existsBySellerId(Long sellerId);
    Page<Shop> findByStatus(ShopStatus status, Pageable pageable);
    boolean existsByNameIgnoreCase(String name);
}
