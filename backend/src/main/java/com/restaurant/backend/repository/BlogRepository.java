package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    // Tìm kiếm bài viết theo slug (rất cần thiết cho trang chi tiết blog phía Frontend)
    Blog findBySlug(String slug);
}