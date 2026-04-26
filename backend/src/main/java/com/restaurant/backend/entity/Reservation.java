package com.restaurant.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;

    private String customerName;
    private String phone;
    private String email;
    private LocalDateTime reservationTime;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private TableEntity table;

    private Integer guestCount;
}