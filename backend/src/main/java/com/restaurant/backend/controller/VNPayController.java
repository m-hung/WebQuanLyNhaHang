package com.restaurant.backend.controller;

import com.restaurant.backend.dto.VNPayCreateRequest;
import com.restaurant.backend.service.ReservationService;
import com.restaurant.backend.service.VNPayService;
import com.restaurant.backend.util.BookingCache;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class VNPayController {

    @Autowired private VNPayService vnPayService;
    @Autowired private ReservationService reservationService;

    // ── POST /api/payment/vnpay-create ──
    @PostMapping("/vnpay-create")
    public ResponseEntity<?> createPayment(
            @RequestBody VNPayCreateRequest req,
            HttpServletRequest httpRequest) {
        try {
            String clientIp = vnPayService.getClientIp(httpRequest);

            // Lưu tạm thông tin đặt bàn — dùng lại khi VNPay return
            BookingCache.save(req.getOrderId(), req);

            String paymentUrl = vnPayService.createPaymentUrl(
                    req.getOrderId(),
                    req.getAmount(),
                    req.getOrderInfo(),
                    clientIp
            );

            return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Không thể tạo URL thanh toán: " + e.getMessage()));
        }
    }

    // ── GET /api/payment/vnpay-return ──
    @GetMapping("/vnpay-return")
    public void handleReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {

        Map<String, String> paramsCopy = new HashMap<>(params);
        boolean validSignature = vnPayService.verifyReturn(paramsCopy);

        String responseCode = params.get("vnp_ResponseCode");
        String orderId = params.get("vnp_TxnRef");

        if (validSignature && "00".equals(responseCode)) {
            try {
                // 1. Lấy thông tin khách hàng đang "treo" trong RAM
                VNPayCreateRequest pending = BookingCache.get(orderId);
                
                if (pending != null) {
                    // 2. Thanh toán OK -> Lưu MỚI vào Database
                    reservationService.createNewReservationAfterPayment(pending, params.get("vnp_TransactionNo"));
                    
                    // 3. Xóa khỏi RAM sau khi đã lưu DB thành công
                    BookingCache.remove(orderId);
                }
            } catch (Exception e) {
                System.err.println("Lỗi lưu DB sau thanh toán: " + e.getMessage());
            }
        } else {
            // Thanh toán thất bại hoặc hủy -> Xóa luôn trong RAM, DB không có gì
            BookingCache.remove(orderId);
        }

        // Redirect về Frontend kết quả
        StringBuilder redirectUrl = new StringBuilder("https://celestehouse.me/src/payment-result.html?");
        params.forEach((k, v) -> {
            try {
                redirectUrl.append(URLEncoder.encode(k, StandardCharsets.UTF_8)).append("=").append(URLEncoder.encode(v, StandardCharsets.UTF_8)).append("&");
            } catch (Exception ignored) {}
        });

        response.sendRedirect(redirectUrl.toString());
    }
}
