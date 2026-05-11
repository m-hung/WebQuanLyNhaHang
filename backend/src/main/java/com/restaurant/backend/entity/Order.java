package com.restaurant.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long orderId;

 @ManyToOne
 @JoinColumn(name = "table_id")
 private TableEntity table;

 private LocalDateTime orderDate;
 private BigDecimal totalAmount;
 private String status; // Đang phục vụ, Đã thanh toán, Đã hủy

 @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
 @ToString.Exclude // Khóa chốt từ 2 đầu cho chắc ăn
 @EqualsAndHashCode.Exclude
 private List<OrderItem> orderItems;
}