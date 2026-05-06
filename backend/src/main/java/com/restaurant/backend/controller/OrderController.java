package com.restaurant.backend.controller;

import com.restaurant.backend.entity.Order;
import com.restaurant.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
// Cấu hình CrossOrigin để React (chạy ở cổng 5173) có thể gọi được API này
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @PutMapping("/{id}/status")
    public org.springframework.http.ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body) {
            
        return orderRepository.findById(id).map(order -> {
            order.setStatus(body.get("status")); // Cập nhật thành "Đã hủy"
            return org.springframework.http.ResponseEntity.ok(orderRepository.save(order));
        }).orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());
    }
}