package com.craftcorner.module.order.service.impl;

import com.craftcorner.common.exception.BusinessException;
import com.craftcorner.common.exception.ResourceNotFoundException;
import com.craftcorner.common.exception.UnauthorizedException;
import com.craftcorner.module.cart.entity.Cart;
import com.craftcorner.module.cart.entity.CartItem;
import com.craftcorner.module.cart.repository.CartRepository;
import com.craftcorner.module.cart.service.CartService;
import com.craftcorner.module.order.dto.*;
import com.craftcorner.module.order.entity.Address;
import com.craftcorner.module.order.entity.Order;
import com.craftcorner.module.order.entity.OrderItem;
import com.craftcorner.module.order.enums.OrderStatus;
import com.craftcorner.module.order.repository.AddressRepository;
import com.craftcorner.module.order.repository.OrderRepository;
import com.craftcorner.module.order.service.OrderService;
import com.craftcorner.module.product.entity.Product;
import com.craftcorner.module.product.enums.ProductStatus;
import com.craftcorner.module.product.repository.ProductRepository;
import com.craftcorner.module.shop.entity.Shop;
import com.craftcorner.module.shop.service.ShopService;
import com.craftcorner.module.user.entity.User;
import com.craftcorner.module.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final BigDecimal DELIVERY_CHARGE = new BigDecimal("60.00");

    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final ShopService shopService;
    private final CartService cartService;

    @Override
    @Transactional
    public OrderDto placeOrder(String buyerEmail, OrderRequest request) {
        User buyer = userService.getEntityByEmail(buyerEmail);

        Cart cart = cartRepository.findByBuyerId(buyer.getId())
                .orElseThrow(() -> new BusinessException("Your cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BusinessException("Your cart is empty");
        }

        Address address = addressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", request.getShippingAddressId()));

        if (!address.getUser().getId().equals(buyer.getId())) {
            throw new UnauthorizedException("Address does not belong to you");
        }

        // Validate stock and calculate totals
        for (CartItem item : cart.getItems()) {
            Product p = item.getProduct();
            if (p.getStatus() != ProductStatus.ACTIVE) {
                throw new BusinessException("Product '" + p.getName() + "' is no longer available");
            }
            if (p.getStockQuantity() < item.getQuantity()) {
                throw new BusinessException("Insufficient stock for: " + p.getName());
            }
            if (p.getShop().getSeller().getId().equals(buyer.getId())) {
                throw new BusinessException("You cannot buy your own product: " + p.getName());
            }
        }

        BigDecimal subtotal = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal total = subtotal.add(DELIVERY_CHARGE);

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .buyer(buyer)
                .shippingAddress(address)
                .subtotal(subtotal)
                .deliveryCharge(DELIVERY_CHARGE)
                .totalAmount(total)
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .build();

        for (CartItem item : cart.getItems()) {
            Product p = item.getProduct();
            String img = p.getImages().stream().filter(i -> i.isPrimary())
                    .map(i -> i.getImageUrl()).findFirst().orElse(null);

            order.getItems().add(OrderItem.builder()
                    .order(order)
                    .product(p)
                    .shop(p.getShop())
                    .productName(p.getName())
                    .productImage(img)
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getSubtotal())
                    .build());

            p.setStockQuantity(p.getStockQuantity() - item.getQuantity());
            if (p.getStockQuantity() == 0) p.setStatus(ProductStatus.OUT_OF_STOCK);
            productRepository.save(p);
        }

        Order saved = orderRepository.save(order);
        cartService.clearCart(buyerEmail);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getMyOrders(String buyerEmail, Pageable pageable) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        return orderRepository.findByBuyerId(buyer.getId(), pageable).map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getSellerOrders(String sellerEmail, Pageable pageable) {
        Shop shop = shopService.getApprovedShopBySellerEmail(sellerEmail);
        return orderRepository.findByShopId(shop.getId(), pageable).map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long id, String userEmail) {
        Order order = findById(id);
        User user = userService.getEntityByEmail(userEmail);
        boolean isBuyer = order.getBuyer().getId().equals(user.getId());
        boolean isSeller = order.getItems().stream()
                .anyMatch(i -> i.getShop().getSeller().getId().equals(user.getId()));
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"));
        if (!isBuyer && !isSeller && !isAdmin) {
            throw new UnauthorizedException("Access denied");
        }
        return toDto(order);
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long id, OrderStatus status, String userEmail) {
        Order order = findById(id);
        User user = userService.getEntityByEmail(userEmail);
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_ADMIN"));
        if (isAdmin) {
            order.getItems().forEach(i -> i.setItemStatus(status));
        } else {
            Shop shop = shopService.getApprovedShopBySellerEmail(userEmail);
            order.getItems().stream()
                    .filter(i -> i.getShop().getId().equals(shop.getId()))
                    .forEach(i -> i.setItemStatus(status));
        }
        order.setOrderStatus(status);
        return toDto(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrders(OrderStatus status, Pageable pageable) {
        return orderRepository.findAllWithOptionalStatus(status, pageable).map(this::toDto);
    }

    private Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    private String generateOrderNumber() {
        return "CC-" + System.currentTimeMillis();
    }

    private OrderDto toDto(Order o) {
        List<OrderItemDto> items = o.getItems().stream().map(this::toItemDto).toList();
        return OrderDto.builder()
                .id(o.getId())
                .orderNumber(o.getOrderNumber())
                .buyerId(o.getBuyer().getId())
                .buyerName(o.getBuyer().getFullName())
                .items(items)
                .subtotal(o.getSubtotal())
                .deliveryCharge(o.getDeliveryCharge())
                .totalAmount(o.getTotalAmount())
                .paymentMethod(o.getPaymentMethod())
                .paymentStatus(o.getPaymentStatus())
                .orderStatus(o.getOrderStatus())
                .notes(o.getNotes())
                .shippingAddress(o.getShippingAddress() != null ? toAddressDto(o.getShippingAddress()) : null)
                .createdAt(o.getCreatedAt())
                .build();
    }

    private OrderItemDto toItemDto(OrderItem i) {
        return OrderItemDto.builder()
                .id(i.getId())
                .productId(i.getProduct().getId())
                .productName(i.getProductName())
                .productImage(i.getProductImage())
                .shopId(i.getShop().getId())
                .shopName(i.getShop().getName())
                .quantity(i.getQuantity())
                .unitPrice(i.getUnitPrice())
                .totalPrice(i.getTotalPrice())
                .itemStatus(i.getItemStatus())
                .build();
    }

    private AddressDto toAddressDto(Address a) {
        return AddressDto.builder()
                .id(a.getId())
                .fullName(a.getFullName())
                .phone(a.getPhone())
                .addressLine1(a.getAddressLine1())
                .addressLine2(a.getAddressLine2())
                .city(a.getCity())
                .state(a.getState())
                .postalCode(a.getPostalCode())
                .country(a.getCountry())
                .isDefault(a.isDefault())
                .build();
    }
}
