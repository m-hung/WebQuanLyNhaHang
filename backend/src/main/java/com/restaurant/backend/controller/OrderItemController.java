package com.restaurant.backend.controller;

import com.restaurant.backend.entity.OrderItem;
import com.restaurant.backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
// Cấu hình CrossOrigin để React (chạy ở cổng 5173) có thể gọi được API này
@CrossOrigin(origins = "http://localhost:5173")
public class OrderItemController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping("/order/{orderId}")
    public List<OrderItem> getItemsByOrder(@PathVariable Long orderId) {
        return orderItemRepository.findByOrder_OrderId(orderId);
    }

    @PostMapping
    public OrderItem addOrderItem(@RequestBody OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }
}