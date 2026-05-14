package com.craftcorner.module.product.service.impl;

import com.craftcorner.common.exception.ResourceNotFoundException;
import com.craftcorner.common.exception.UnauthorizedException;
import com.craftcorner.module.category.entity.Category;
import com.craftcorner.module.category.repository.CategoryRepository;
import com.craftcorner.module.product.dto.ProductDto;
import com.craftcorner.module.product.dto.ProductRequest;
import com.craftcorner.module.product.entity.Product;
import com.craftcorner.module.product.entity.ProductImage;
import com.craftcorner.module.product.enums.ProductStatus;
import com.craftcorner.module.product.repository.ProductRepository;
import com.craftcorner.module.product.service.ProductService;
import com.craftcorner.module.shop.entity.Shop;
import com.craftcorner.module.shop.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ShopService shopService;

    @Override
    @Transactional
    public ProductDto createProduct(String sellerEmail, ProductRequest request) {
        Shop shop = shopService.getApprovedShopBySellerEmail(sellerEmail);
        Category category = findCategory(request.getCategoryId());

        Product product = Product.builder()
                .shop(shop)
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity())
                .material(request.getMaterial())
                .productionTime(request.getProductionTime())
                .deliveryOption(request.getDeliveryOption())
                .build();

        addImages(product, request.getImageUrls());
        return toDto(productRepository.save(product));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        return toDto(findById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getAllActiveProducts(Pageable pageable) {
        return productRepository.findByStatus(ProductStatus.ACTIVE, pageable).map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsByShop(Long shopId, Pageable pageable) {
        return productRepository.findActiveByShopId(shopId, pageable).map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable).map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchByKeyword(keyword, pageable).map(this::toDto);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long id, String sellerEmail, ProductRequest request) {
        Product product = findById(id);
        assertOwner(product, sellerEmail);

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setMaterial(request.getMaterial());
        product.setProductionTime(request.getProductionTime());
        product.setDeliveryOption(request.getDeliveryOption());
        product.setCategory(findCategory(request.getCategoryId()));

        if (request.getImageUrls() != null) {
            product.getImages().clear();
            addImages(product, request.getImageUrls());
        }

        return toDto(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id, String sellerEmail) {
        Product product = findById(id);
        assertOwner(product, sellerEmail);
        productRepository.delete(product);
    }

    @Override
    @Transactional
    public void toggleProductStatus(Long id, String sellerEmail) {
        Product product = findById(id);
        assertOwner(product, sellerEmail);
        product.setStatus(product.getStatus() == ProductStatus.ACTIVE ? ProductStatus.INACTIVE : ProductStatus.ACTIVE);
        productRepository.save(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getMyProducts(String sellerEmail, Pageable pageable) {
        Shop shop = shopService.getApprovedShopBySellerEmail(sellerEmail);
        return productRepository.findByShopId(shop.getId(), pageable).map(this::toDto);
    }

    private void addImages(Product product, List<String> urls) {
        if (urls == null || urls.isEmpty()) return;
        for (int i = 0; i < urls.size(); i++) {
            product.getImages().add(ProductImage.builder()
                    .product(product)
                    .imageUrl(urls.get(i))
                    .isPrimary(i == 0)
                    .displayOrder(i)
                    .build());
        }
    }

    private Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
    }

    private void assertOwner(Product product, String email) {
        if (!product.getShop().getSeller().getEmail().equals(email)) {
            throw new UnauthorizedException("You do not own this product");
        }
    }

    private ProductDto toDto(Product p) {
        List<String> imageUrls = p.getImages().stream().map(ProductImage::getImageUrl).toList();
        String primary = p.getImages().stream()
                .filter(ProductImage::isPrimary).map(ProductImage::getImageUrl)
                .findFirst().orElse(imageUrls.isEmpty() ? null : imageUrls.get(0));

        return ProductDto.builder()
                .id(p.getId())
                .shopId(p.getShop().getId())
                .shopName(p.getShop().getName())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .discountPrice(p.getDiscountPrice())
                .effectivePrice(p.getEffectivePrice())
                .stockQuantity(p.getStockQuantity())
                .material(p.getMaterial())
                .productionTime(p.getProductionTime())
                .deliveryOption(p.getDeliveryOption())
                .status(p.getStatus())
                .averageRating(p.getAverageRating())
                .reviewCount(p.getReviewCount())
                .imageUrls(imageUrls)
                .primaryImageUrl(primary)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
