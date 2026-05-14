package com.craftcorner.module.order.service;

import com.craftcorner.module.order.dto.OrderDto;
import com.craftcorner.module.order.dto.OrderRequest;
import com.craftcorner.module.order.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderDto placeOrder(String buyerEmail, OrderRequest request);
    Page<OrderDto> getMyOrders(String buyerEmail, Pageable pageable);
    Page<OrderDto> getSellerOrders(String sellerEmail, Pageable pageable);
    OrderDto getOrderById(Long id, String userEmail);
    OrderDto updateOrderStatus(Long id, OrderStatus status, String sellerEmail);
    Page<OrderDto> getAllOrders(OrderStatus status, Pageable pageable);
}
