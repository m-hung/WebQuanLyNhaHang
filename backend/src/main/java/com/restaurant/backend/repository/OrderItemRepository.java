package com.restaurant.backend.repository;

import com.restaurant.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map; // Bắt buộc phải có

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
 List<OrderItem> findByOrder_OrderId(Long orderId);

 // Dùng thẳng Map, không dùng Interface nữa để chống crash
 @Query(value = "SELECT m.name as name, SUM(oi.quantity) as qty, SUM(oi.subtotal) as revenue " +
                   "FROM order_items oi " +
                   "JOIN menu_items m ON oi.item_id = m.item_id " +
                   "JOIN orders o ON oi.order_id = o.order_id " +
                   "WHERE o.status = 'Paid' " +
                   "AND MONTH(CONVERT_TZ(o.order_date, 'UTC', '+07:00')) = MONTH(CURDATE()) " +
                   "AND YEAR(CONVERT_TZ(o.order_date, 'UTC', '+07:00')) = YEAR(CURDATE()) " +
                   "GROUP BY m.item_id, m.name " +
                   "ORDER BY SUM(oi.quantity) DESC, SUM(oi.subtotal) DESC LIMIT 10", nativeQuery = true)
    List<Map<String, Object>> getTopDishes();
}