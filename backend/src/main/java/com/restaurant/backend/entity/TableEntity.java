package com.restaurant.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurant_tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tableId;

    private String tableNumber;
    private Integer capacity;
    private String status; // Trống, Đang có khách, Đã đặt
}