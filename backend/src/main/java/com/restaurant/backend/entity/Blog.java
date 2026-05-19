package com.restaurant.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blogs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blogId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(name = "img_url", length = 500)
    private String imgUrl;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, columnDefinition = "LONGTEXT") // Dùng LONGTEXT để chứa nội dung bài viết dài có dấu
    private String content;

    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @Column(name = "active", nullable = false)
    private boolean active = true; // true: Hiện, false: Ẩn

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Tự động gán thời gian tạo trước khi lưu vào database
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}