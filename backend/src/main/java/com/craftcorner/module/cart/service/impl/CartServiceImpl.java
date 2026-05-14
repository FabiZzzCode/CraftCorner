package com.craftcorner.module.cart.service.impl;

import com.craftcorner.common.exception.BusinessException;
import com.craftcorner.common.exception.ResourceNotFoundException;
import com.craftcorner.module.cart.dto.CartDto;
import com.craftcorner.module.cart.dto.CartItemDto;
import com.craftcorner.module.cart.dto.CartItemRequest;
import com.craftcorner.module.cart.entity.Cart;
import com.craftcorner.module.cart.entity.CartItem;
import com.craftcorner.module.cart.repository.CartItemRepository;
import com.craftcorner.module.cart.repository.CartRepository;
import com.craftcorner.module.cart.service.CartService;
import com.craftcorner.module.product.entity.Product;
import com.craftcorner.module.product.enums.ProductStatus;
import com.craftcorner.module.product.repository.ProductRepository;
import com.craftcorner.module.user.entity.User;
import com.craftcorner.module.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    private static final BigDecimal DELIVERY_CHARGE = new BigDecimal("60.00");

    @Override
    @Transactional
    public CartDto addItem(String buyerEmail, CartItemRequest request) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        Product product = findProduct(request.getProductId());

        validateProduct(product, request.getQuantity());

        Cart cart = cartRepository.findByBuyerId(buyer.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().buyer(buyer).build()));

        cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .ifPresentOrElse(
                        item -> {
                            int newQty = item.getQuantity() + request.getQuantity();
                            if (newQty > product.getStockQuantity()) {
                                throw new BusinessException("Not enough stock available");
                            }
                            item.setQuantity(newQty);
                            cartItemRepository.save(item);
                        },
                        () -> cartItemRepository.save(CartItem.builder()
                                .cart(cart)
                                .product(product)
                                .quantity(request.getQuantity())
                                .unitPrice(product.getEffectivePrice())
                                .build())
                );

        return buildCartDto(cartRepository.findById(cart.getId()).orElseThrow());
    }

    @Override
    @Transactional(readOnly = true)
    public CartDto getCart(String buyerEmail) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        Cart cart = cartRepository.findByBuyerId(buyer.getId())
                .orElse(Cart.builder().buyer(buyer).build());
        return buildCartDto(cart);
    }

    @Override
    @Transactional
    public CartDto updateItem(String buyerEmail, Long cartItemId, Integer quantity) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        Cart cart = getCartByBuyer(buyer.getId());
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BusinessException("Cart item does not belong to your cart");
        }

        Product product = item.getProduct();
        if (quantity > product.getStockQuantity()) {
            throw new BusinessException("Not enough stock. Available: " + product.getStockQuantity());
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return buildCartDto(cartRepository.findById(cart.getId()).orElseThrow());
    }

    @Override
    @Transactional
    public CartDto removeItem(String buyerEmail, Long cartItemId) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        Cart cart = getCartByBuyer(buyer.getId());
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BusinessException("Cart item does not belong to your cart");
        }

        cartItemRepository.delete(item);
        return buildCartDto(cartRepository.findById(cart.getId()).orElseThrow());
    }

    @Override
    @Transactional
    public void clearCart(String buyerEmail) {
        User buyer = userService.getEntityByEmail(buyerEmail);
        cartRepository.findByBuyerId(buyer.getId()).ifPresent(cart -> {
            cartItemRepository.deleteByCartId(cart.getId());
        });
    }

    private Cart getCartByBuyer(Long buyerId) {
        return cartRepository.findByBuyerId(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    private Product findProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
    }

    private void validateProduct(Product product, int qty) {
        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new BusinessException("Product is not available");
        }
        if (product.getStockQuantity() < qty) {
            throw new BusinessException("Not enough stock. Available: " + product.getStockQuantity());
        }
    }

    private CartDto buildCartDto(Cart cart) {
        List<CartItemDto> itemDtos = cart.getItems().stream().map(this::toItemDto).toList();
        BigDecimal subtotal = itemDtos.stream()
                .map(CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal delivery = subtotal.compareTo(BigDecimal.ZERO) > 0 ? DELIVERY_CHARGE : BigDecimal.ZERO;

        return CartDto.builder()
                .id(cart.getId())
                .buyerId(cart.getBuyer().getId())
                .items(itemDtos)
                .subtotal(subtotal)
                .deliveryCharge(delivery)
                .total(subtotal.add(delivery))
                .itemCount(itemDtos.size())
                .build();
    }

    private CartItemDto toItemDto(CartItem item) {
        Product p = item.getProduct();
        String img = p.getImages().stream().filter(i -> i.isPrimary()).map(i -> i.getImageUrl())
                .findFirst().orElse(null);
        return CartItemDto.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productImage(img)
                .shopId(p.getShop().getId())
                .shopName(p.getShop().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .availableStock(p.getStockQuantity())
                .build();
    }
}
