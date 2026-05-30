package com.restaurant.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "name_vi", nullable = false)
    private String nameVi;

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(name = "description_vi", columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    private BigDecimal price;
    private Double discount;

    @Lob // Thêm @Lob để Spring Boot hiểu đây là dữ liệu lớn
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;
    
    private Boolean isAvailable;
}