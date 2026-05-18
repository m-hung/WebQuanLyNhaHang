package com.restaurant.backend.util;  // ← đổi thành package của bạn

import com.restaurant.backend.dto.VNPayCreateRequest;  // ← đổi thành package của bạn
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Lưu tạm thông tin đặt bàn trong memory theo orderId.
 * Dùng để map lại khi VNPay redirect về /vnpay-return.
 */
public class BookingCache {

    private static final Map<String, VNPayCreateRequest> STORE = new ConcurrentHashMap<>();

    public static void save(String orderId, VNPayCreateRequest req) {
        STORE.put(orderId, req);
    }

    public static VNPayCreateRequest get(String orderId) {
        return STORE.get(orderId);
    }

    public static void remove(String orderId) {
        STORE.remove(orderId);
    }
}
