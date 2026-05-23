package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    // Tìm kiếm bài viết theo slug (dùng cho trang chi tiết blog)
    Blog findBySlug(String slug);

    // Lấy tất cả bài viết đang hiển thị (active = true) — dùng cho trang public blog.html
    List<Blog> findByActiveTrue();
}
