package com.restaurant.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private MenuItem menuItem;

    private Integer quantity;
    private BigDecimal subtotal;
    private String note;
}