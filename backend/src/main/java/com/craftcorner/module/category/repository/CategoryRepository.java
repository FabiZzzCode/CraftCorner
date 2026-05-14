package com.craftcorner.module.category.repository;

import com.craftcorner.module.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByIsActiveTrue();
    boolean existsByNameIgnoreCase(String name);
}
