package com.restaurant.backend.repository;

import com.restaurant.backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    // Tìm các món ăn thuộc một danh mục cụ thể
    List<MenuItem> findByCategory_CategoryId(Long categoryId);

    // Tìm các món đang còn hàng (available)
    List<MenuItem> findByIsAvailableTrue();
}