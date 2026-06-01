package com.restaurant.backend.controller;

import com.restaurant.backend.entity.Payment;
import com.restaurant.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/order/{orderId}")
    public Payment getPaymentByOrder(@PathVariable Long orderId) {
        return paymentRepository.findByOrder_OrderId(orderId);
    }

    @PostMapping
    public Payment processPayment(@RequestBody Payment payment) {
        return paymentRepository.save(payment);
    }
}