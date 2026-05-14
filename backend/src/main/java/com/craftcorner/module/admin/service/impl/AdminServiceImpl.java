package com.craftcorner.module.admin.service.impl;

import com.craftcorner.module.admin.dto.DashboardStatsDto;
import com.craftcorner.module.admin.service.AdminService;
import com.craftcorner.module.order.enums.OrderStatus;
import com.craftcorner.module.order.repository.OrderRepository;
import com.craftcorner.module.product.repository.ProductRepository;
import com.craftcorner.module.shop.enums.ShopStatus;
import com.craftcorner.module.shop.repository.ShopRepository;
import com.craftcorner.module.user.enums.RoleType;
import com.craftcorner.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        return DashboardStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalSellers(userRepository.findByRole(RoleType.ROLE_SELLER, PageRequest.of(0, 1)).getTotalElements())
                .totalBuyers(userRepository.findByRole(RoleType.ROLE_BUYER, PageRequest.of(0, 1)).getTotalElements())
                .totalShops(shopRepository.count())
                .pendingShops(shopRepository.findByStatus(ShopStatus.PENDING, PageRequest.of(0, 1)).getTotalElements())
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByOrderStatus(OrderStatus.PENDING))
                .totalRevenue(BigDecimal.ZERO)
                .build();
    }
}
