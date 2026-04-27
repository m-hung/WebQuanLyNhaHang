package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Tìm thông tin thanh toán theo mã đơn hàng
    Payment findByOrder_OrderId(Long orderId);
}