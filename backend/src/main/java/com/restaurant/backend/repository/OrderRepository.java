package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Tìm các đơn hàng chưa thanh toán của một bàn
    List<Order> findByTable_TableIdAndStatus(Long tableId, String status);
}