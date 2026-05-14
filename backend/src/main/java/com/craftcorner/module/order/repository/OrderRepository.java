package com.craftcorner.module.order.repository;

import com.craftcorner.module.order.entity.Order;
import com.craftcorner.module.order.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByBuyerId(Long buyerId, Pageable pageable);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.shop.id = :shopId")
    Page<Order> findByShopId(@Param("shopId") Long shopId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(i.totalPrice), 0) FROM OrderItem i WHERE i.shop.id = :shopId AND i.itemStatus = 'DELIVERED'")
    BigDecimal getTotalRevenueByShopId(@Param("shopId") Long shopId);

    long countByBuyerId(Long buyerId);
    long countByOrderStatus(OrderStatus status);

    @Query("SELECT o FROM Order o WHERE (:status IS NULL OR o.orderStatus = :status) ORDER BY o.createdAt DESC")
    Page<Order> findAllWithOptionalStatus(@Param("status") OrderStatus status, Pageable pageable);
}
