package com.restaurant.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "restaurant_tables")
@NoArgsConstructor
@AllArgsConstructor
public class TableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tableId;

    @Column(name = "table_number", unique = true) // Thêm unique để không bao giờ bị lặp số bàn
    private String tableNumber;

    private Integer capacity;
    private String status; // Trống, Đang có khách, Đã đặt
}