package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Bạn có thể thêm phương thức tìm kiếm theo tên nếu cần
    Category findByName(String name);
}