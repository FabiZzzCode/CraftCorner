package com.craftcorner.module.order.controller;

import com.craftcorner.common.response.ApiResponse;
import com.craftcorner.common.response.PageResponse;
import com.craftcorner.module.order.dto.OrderDto;
import com.craftcorner.module.order.dto.OrderRequest;
import com.craftcorner.module.order.enums.OrderStatus;
import com.craftcorner.module.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<ApiResponse<OrderDto>> placeOrder(@AuthenticationPrincipal UserDetails userDetails,
                                                             @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.placeOrder(userDetails.getUsername(), request), "Order placed successfully"));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderDto>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                PageResponse.of(orderService.getMyOrders(userDetails.getUsername(), PageRequest.of(page, size)))));
    }

    @GetMapping("/seller-orders")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<PageResponse<OrderDto>>> getSellerOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                PageResponse.of(orderService.getSellerOrders(userDetails.getUsername(), PageRequest.of(page, size)))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable Long id,
                                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getOrderById(id, userDetails.getUsername())));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<OrderDto>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                PageResponse.of(orderService.getAllOrders(status, PageRequest.of(page, size)))));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderDto>> updateStatus(@PathVariable Long id,
                                                               @RequestParam OrderStatus status,
                                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.updateOrderStatus(id, status, userDetails.getUsername())));
    }
}
