package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    // Tìm bài viết theo slug (dùng cho trang chi tiết)
    Blog findBySlug(String slug);

    // Lấy các bài viết đang hiển thị (active = true)
    List<Blog> findByActiveTrue();

    // Tìm kiếm theo tiêu đề (tùy chọn, dùng sau)
    List<Blog> findByTitleViContainingIgnoreCase(String titleVi);
    List<Blog> findByTitleEnContainingIgnoreCase(String titleEn);
}
