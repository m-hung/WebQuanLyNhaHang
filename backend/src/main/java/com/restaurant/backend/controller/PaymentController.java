package com.restaurant.backend.controller;

import com.restaurant.backend.entity.Payment;
import com.restaurant.backend.entity.Order;
import com.restaurant.backend.repository.PaymentRepository;
import com.restaurant.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
// Cấu hình CrossOrigin để React (chạy ở cổng 5173) có thể gọi được API này
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/order/{orderId}")
    public Payment getPaymentByOrder(@PathVariable Long orderId) {
        return paymentRepository.findByOrder_OrderId(orderId);
    }

    @PostMapping
    public Payment processPayment(@RequestBody Payment payment) {
        Payment savedPayment = paymentRepository.save(payment);
        
        // Tự động cập nhật trạng thái order thành "Paid"
        if (payment.getOrder() != null && payment.getOrder().getOrderId() != null) {
            Optional<Order> order = orderRepository.findById(payment.getOrder().getOrderId());
            if (order.isPresent()) {
                Order orderToUpdate = order.get();
                orderToUpdate.setStatus("Paid");
                orderRepository.save(orderToUpdate);
            }
        }
        
        return savedPayment;
    }
}