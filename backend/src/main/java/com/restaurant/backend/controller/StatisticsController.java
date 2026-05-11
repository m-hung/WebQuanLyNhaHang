package com.restaurant.backend.controller;

import com.restaurant.backend.repository.OrderRepository;
import com.restaurant.backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:5173")
public class StatisticsController {

 @Autowired
  private OrderRepository orderRepository;
 @Autowired
 private OrderItemRepository orderItemRepository;

 @GetMapping
 public Map<String, Object> getDashboardStatistics() {
 Map<String, Object> stats = new HashMap<>();

 // Lấy 4 ô tổng quan
 stats.put("todayRevenue", orderRepository.getTodayRevenue());
 stats.put("todayOrders", orderRepository.getTodayOrders());
 stats.put("monthlyRevenue", orderRepository.getMonthlyRevenue());
 stats.put("monthlyOrders", orderRepository.getMonthlyOrders());

 // Lấy dữ liệu biểu đồ và bảng xếp hạng
 stats.put("weeklyData", orderRepository.getWeeklyRevenue());
 stats.put("topDishes", orderItemRepository.getTopDishes());

 return stats; // Trả về 1 cục JSON xịn xò cho React
 }
}