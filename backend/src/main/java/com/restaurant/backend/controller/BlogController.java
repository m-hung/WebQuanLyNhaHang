package com.restaurant.backend.controller;

import com.restaurant.backend.entity.Blog;
import com.restaurant.backend.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "http://localhost:5173") // Khớp với cổng React/Vite của bạn
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    // 1. Lấy tất cả bài viết
    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // 2. Lấy chi tiết bài viết theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Tạo bài viết mới
    @PostMapping
    public Blog createBlog(@RequestBody Blog blog) {
        return blogRepository.save(blog);
    }

    // 4. Cập nhật bài viết
    @PutMapping("/{id}")
    public Blog updateBlog(@PathVariable Long id, @RequestBody Blog blogDetails) {
        return blogRepository.findById(id).map(blog -> {
            // Cập nhật Tiêu đề đa ngôn ngữ
            blog.setTitleVi(blogDetails.getTitleVi());
            blog.setTitleEn(blogDetails.getTitleEn());
            
            // Cập nhật Tóm tắt đa ngôn ngữ
            blog.setSummaryVi(blogDetails.getSummaryVi());
            blog.setSummaryEn(blogDetails.getSummaryEn());
            
            // Cập nhật Nội dung đa ngôn ngữ
            blog.setContentVi(blogDetails.getContentVi());
            blog.setContentEn(blogDetails.getContentEn());
            
            // Các trường chung giữ nguyên
            blog.setSlug(blogDetails.getSlug());
            blog.setImgUrl(blogDetails.getImgUrl());
            blog.setAuthorName(blogDetails.getAuthorName());
            blog.setActive(blogDetails.isActive()); // Ẩn hoặc Hiện bài viết
            
            return blogRepository.save(blog);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy blog với ID: " + id));
    }

    // 5. Xóa bài viết
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        try {
            blogRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}