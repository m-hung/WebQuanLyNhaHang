package com.restaurant.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @Column(name = "cashier_name")
    private String cashierName;
    
    // Thêm thuộc tính VAT để lưu số tiền thuế hoặc phần trăm thuế
    private BigDecimal vat; 
    
    private String status; // Đang phục vụ, Đã thanh toán, Đã hủy

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItem> orderItems;

    @PrePersist
    protected void onCreate() {
        if (this.orderDate == null) {
            this.orderDate = LocalDateTime.now();
        }
        // Bạn có thể set giá trị mặc định cho VAT tại đây nếu cần (Ví dụ: mặc định là 0)
        if (this.vat == null) {
            this.vat = BigDecimal.ZERO;
        }
    }
}