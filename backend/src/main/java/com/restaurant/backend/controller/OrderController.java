package com.restaurant.backend.controller;

import com.restaurant.backend.entity.Order;
import com.restaurant.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
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
            order.setStatus(body.get("status")); // Cập nhật trạng thái
            return org.springframework.http.ResponseEntity.ok(orderRepository.save(order));
        }).orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());
    }

    // ĐÂY LÀ ĐOẠN API MỚI THÊM VÀO ĐỂ CẬP NHẬT BÀN VÀ TỔNG TIỀN
    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<Order> updateOrder(
            @PathVariable Long id, 
            @RequestBody Order orderDetails) {
            
        return orderRepository.findById(id).map(order -> {
            // Nếu có đổi bàn thì cập nhật bàn mới
            if (orderDetails.getTable() != null) {
                order.setTable(orderDetails.getTable());
            }
            // Cập nhật lại tổng tiền (nếu khách gọi thêm món/bớt món)
            if (orderDetails.getTotalAmount() != null) {
                order.setTotalAmount(orderDetails.getTotalAmount());
            }
            return org.springframework.http.ResponseEntity.ok(orderRepository.save(order));
        }).orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());
    }
}