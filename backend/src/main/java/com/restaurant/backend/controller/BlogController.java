package com.restaurant.backend.controller;

import com.restaurant.backend.entity.Blog;
import com.restaurant.backend.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*") // Cho phép cả React admin (5173) và blog.html (file/live server)
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    // 1. Lấy tất cả bài viết (dùng cho trang Admin)
    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // 2. Lấy chỉ bài viết đang active = true (dùng cho trang blog.html public)
    @GetMapping("/active")
    public List<Blog> getActiveBlogs() {
        return blogRepository.findByActiveTrue();
    }

    // 3. Lấy chi tiết bài viết theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Lấy bài viết theo slug (cho trang chi tiết)
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Blog> getBlogBySlug(@PathVariable String slug) {
        Blog blog = blogRepository.findBySlug(slug);
        if (blog == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(blog);
    }

    // 5. Tạo bài viết mới
    @PostMapping
    public Blog createBlog(@RequestBody Blog blog) {
        return blogRepository.save(blog);
    }

    // 6. Cập nhật bài viết
    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable Long id, @RequestBody Blog blogDetails) {
        return blogRepository.findById(id).map(blog -> {
            blog.setTitle(blogDetails.getTitle());
            blog.setSlug(blogDetails.getSlug());
            blog.setImgUrl(blogDetails.getImgUrl());
            blog.setSummary(blogDetails.getSummary());
            blog.setContent(blogDetails.getContent());
            blog.setAuthorName(blogDetails.getAuthorName());
            blog.setActive(blogDetails.isActive());
            return ResponseEntity.ok(blogRepository.save(blog));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 7. Xóa bài viết
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        if (!blogRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        blogRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
