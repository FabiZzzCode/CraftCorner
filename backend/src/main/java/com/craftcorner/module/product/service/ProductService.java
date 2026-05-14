package com.craftcorner.module.product.service;

import com.craftcorner.module.product.dto.ProductDto;
import com.craftcorner.module.product.dto.ProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    ProductDto createProduct(String sellerEmail, ProductRequest request);
    ProductDto getProductById(Long id);
    Page<ProductDto> getAllActiveProducts(Pageable pageable);
    Page<ProductDto> getProductsByShop(Long shopId, Pageable pageable);
    Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable);
    Page<ProductDto> searchProducts(String keyword, Pageable pageable);
    ProductDto updateProduct(Long id, String sellerEmail, ProductRequest request);
    void deleteProduct(Long id, String sellerEmail);
    void toggleProductStatus(Long id, String sellerEmail);
    Page<ProductDto> getMyProducts(String sellerEmail, Pageable pageable);
}
