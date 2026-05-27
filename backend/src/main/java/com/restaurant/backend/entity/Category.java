package com.restaurant.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(name = "name_vi", nullable = false)
    private String nameVi;

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @JsonIgnore
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<MenuItem> menuItems;
}