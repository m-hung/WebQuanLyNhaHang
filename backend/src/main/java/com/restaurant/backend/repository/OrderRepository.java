package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
 
 List<Order> findByTable_TableIdAndStatus(Long tableId, String status);

 // Đã đổi java.math.BigDecimal thành Double
 @Query(value = "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'Paid' AND DATE(CONVERT_TZ(order_date, 'UTC', '+07:00')) = CURDATE()", nativeQuery = true)
 Double getTodayRevenue(); 

 @Query(value = "SELECT COUNT(order_id) FROM orders WHERE status = 'Paid' AND DATE(CONVERT_TZ(order_date, 'UTC', '+07:00')) = CURDATE()", nativeQuery = true)
 Long getTodayOrders();

 // Đã đổi java.math.BigDecimal thành Double
 @Query(value = "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'Paid' AND MONTH(CONVERT_TZ(order_date, 'UTC', '+07:00')) = MONTH(CURDATE()) AND YEAR(CONVERT_TZ(order_date, 'UTC', '+07:00')) = YEAR(CURDATE())", nativeQuery = true)
 Double getMonthlyRevenue(); 

 @Query(value = "SELECT COUNT(order_id) FROM orders WHERE status = 'Paid' AND MONTH(CONVERT_TZ(order_date, 'UTC', '+07:00')) = MONTH(CURDATE()) AND YEAR(CONVERT_TZ(order_date, 'UTC', '+07:00')) = YEAR(CURDATE())", nativeQuery = true)
 Long getMonthlyOrders();

 @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(order_date, 'UTC', '+07:00'), '%d/%m') as name, SUM(total_amount) as revenue " +
"FROM orders " +
"WHERE status = 'Paid' AND CONVERT_TZ(order_date, 'UTC', '+07:00') >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) " +
"GROUP BY DATE(CONVERT_TZ(order_date, 'UTC', '+07:00')), DATE_FORMAT(CONVERT_TZ(order_date, 'UTC', '+07:00'), '%d/%m') " +
"ORDER BY DATE(CONVERT_TZ(order_date, 'UTC', '+07:00')) ASC", nativeQuery = true)
 List<Map<String, Object>> getWeeklyRevenue();
}