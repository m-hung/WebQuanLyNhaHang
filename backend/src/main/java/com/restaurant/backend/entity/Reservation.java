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
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private TableEntity table;

    private Integer guestCount;

    // ── Thêm mới cho VNPay ──
    private Boolean isPaid = false;   // true sau khi VNPay xác nhận
    private String paymentRef;        // orderId từ frontend (VD: CH1A2B3X)
    private String transactionNo;     // Mã giao dịch từ VNPay

    @Column(name = "status")
    private String status;

}
