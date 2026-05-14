package com.craftcorner.module.shop.controller;

import com.craftcorner.common.response.ApiResponse;
import com.craftcorner.common.response.PageResponse;
import com.craftcorner.module.shop.dto.ShopDto;
import com.craftcorner.module.shop.dto.ShopRequest;
import com.craftcorner.module.shop.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<ShopDto>> createShop(@AuthenticationPrincipal UserDetails userDetails,
                                                            @Valid @RequestBody ShopRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                shopService.createShop(userDetails.getUsername(), request), "Shop created and pending approval"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ShopDto>>> getAllShops(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                PageResponse.of(shopService.getAllShops(PageRequest.of(page, size)))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShopDto>> getShopById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(shopService.getShopById(id)));
    }

    @GetMapping("/my-shop")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<ShopDto>> getMyShop(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(shopService.getMyShop(userDetails.getUsername())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<ShopDto>> updateShop(@PathVariable Long id,
                                                            @AuthenticationPrincipal UserDetails userDetails,
                                                            @Valid @RequestBody ShopRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                shopService.updateShop(id, userDetails.getUsername(), request)));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ShopDto>> approveShop(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(shopService.approveShop(id), "Shop approved"));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ShopDto>> rejectShop(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(shopService.rejectShop(id), "Shop rejected"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteShop(@PathVariable Long id) {
        shopService.deleteShop(id);
        return ResponseEntity.ok(ApiResponse.success("Shop deleted"));
    }
}
