package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    
    // Tìm kiếm bài viết theo slug (Giữ nguyên - Phục vụ trang chi tiết blog bên Frontend)
    Blog findBySlug(String slug);

    // =========================================================================
    // BỔ SUNG THÊM (Tùy chọn): Phục vụ cho chức năng tìm kiếm bài viết sau này
    // =========================================================================

    // Tìm kiếm bài viết theo từ khóa Tiêu đề tiếng Việt
    List<Blog> findByTitleViContainingIgnoreCase(String titleVi);

    // Tìm kiếm bài viết theo từ khóa Tiêu đề tiếng Anh
    List<Blog> findByTitleEnContainingIgnoreCase(String titleEn);
}