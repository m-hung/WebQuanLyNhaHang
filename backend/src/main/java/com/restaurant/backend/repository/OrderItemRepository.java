package com.restaurant.backend.repository;

import com.restaurant.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Lấy tất cả các món trong một đơn hàng
    List<OrderItem> findByOrder_OrderId(Long orderId);
}