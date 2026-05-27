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

    // --- TIÊU ĐỀ ĐA NGÔN NGỮ ---
    @Column(name = "title_vi", nullable = false, length = 255)
    private String titleVi;

    @Column(name = "title_en", nullable = false, length = 255)
    private String titleEn;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(name = "img_url", length = 500)
    private String imgUrl;

    // --- TÓM TẮT ĐA NGÔN NGỮ ---
    @Column(name = "summary_vi", columnDefinition = "TEXT")
    private String summaryVi;

    @Column(name = "summary_en", columnDefinition = "TEXT")
    private String summaryEn;

    // --- NỘI DUNG ĐA NGÔN NGỮ ---
    @Column(name = "content_vi", nullable = false, columnDefinition = "LONGTEXT")
    private String contentVi;

    @Column(name = "content_en", nullable = false, columnDefinition = "LONGTEXT")
    private String contentEn;

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