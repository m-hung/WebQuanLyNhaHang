package com.restaurant.backend.controller;

import com.restaurant.backend.entity.Blog;
import com.restaurant.backend.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "http://localhost:5173")
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    // 1. Lấy tất cả bài viết (dùng cho trang admin)
    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // 2. Lấy các bài viết đang hiển thị (dùng cho trang blog.html khách hàng)
    @GetMapping("/active")
    public List<Blog> getActiveBlogs() {
        return blogRepository.findByActiveTrue();
    }

    // 3. Lấy chi tiết bài viết theo slug (dùng cho trang blog-detail.html)
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Blog> getBlogBySlug(@PathVariable String slug) {
        Blog blog = blogRepository.findBySlug(slug);
        if (blog == null || !blog.isActive()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(blog);
    }

    // 4. Lấy chi tiết bài viết theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. Tạo bài viết mới
    @PostMapping
    public Blog createBlog(@RequestBody Blog blog) {
        return blogRepository.save(blog);
    }

    // 6. Cập nhật bài viết
    @PutMapping("/{id}")
    public Blog updateBlog(@PathVariable Long id, @RequestBody Blog blogDetails) {
        return blogRepository.findById(id).map(blog -> {
            blog.setTitleVi(blogDetails.getTitleVi());
            blog.setTitleEn(blogDetails.getTitleEn());
            blog.setSummaryVi(blogDetails.getSummaryVi());
            blog.setSummaryEn(blogDetails.getSummaryEn());
            blog.setContentVi(blogDetails.getContentVi());
            blog.setContentEn(blogDetails.getContentEn());
            blog.setSlug(blogDetails.getSlug());
            blog.setImgUrl(blogDetails.getImgUrl());
            blog.setAuthorName(blogDetails.getAuthorName());
            blog.setActive(blogDetails.isActive());
            return blogRepository.save(blog);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy blog với ID: " + id));
    }

    // 7. Xóa bài viết
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
