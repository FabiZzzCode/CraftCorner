package com.craftcorner.module.category.service;

import com.craftcorner.module.category.dto.CategoryDto;
import com.craftcorner.module.category.dto.CategoryRequest;

import java.util.List;

public interface CategoryService {
    CategoryDto create(CategoryRequest request);
    List<CategoryDto> getAll();
    CategoryDto getById(Long id);
    CategoryDto update(Long id, CategoryRequest request);
    void delete(Long id);
    void toggleActive(Long id);
}
