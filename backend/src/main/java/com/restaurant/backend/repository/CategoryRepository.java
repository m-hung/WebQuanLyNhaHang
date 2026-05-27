package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Tìm kiếm danh mục theo tên Tiếng Việt
    Optional<Category> findByNameVi(String nameVi);

    // Tìm kiếm danh mục theo tên Tiếng Anh
    Optional<Category> findByNameEn(String nameEn);
}