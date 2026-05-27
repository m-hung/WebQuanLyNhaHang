package com.restaurant.backend.repository;

import com.restaurant.backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    // Tìm các món ăn thuộc một danh mục cụ thể (Giữ nguyên - vẫn chạy tốt)
    List<MenuItem> findByCategory_CategoryId(Long categoryId);

    // Tìm các món đang còn hàng (Giữ nguyên - vẫn chạy tốt)
    List<MenuItem> findByIsAvailableTrue();

    // =========================================================================
    // BỔ SUNG THÊM (Tùy chọn): Phục vụ cho chức năng tìm kiếm món ăn sau này
    // =========================================================================
    
    // Tìm kiếm món ăn theo từ khóa tiếng Việt (không phân biệt hoa thường)
    List<MenuItem> findByNameViContainingIgnoreCase(String nameVi);

    // Tìm kiếm món ăn theo từ khóa tiếng Anh (không phân biệt hoa thường)
    List<MenuItem> findByNameEnContainingIgnoreCase(String nameEn);
}