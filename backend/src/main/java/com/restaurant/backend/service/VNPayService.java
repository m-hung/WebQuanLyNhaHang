package com.restaurant.backend.service;

import com.restaurant.backend.config.VNPayConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TreeMap;

@Service
public class VNPayService {

    @Autowired
    private VNPayConfig config;

    // ── VNPay yêu cầu thời gian theo GMT+7 ──
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter VNP_DATE_FMT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    public String createPaymentUrl(String orderId, long amount,
                                   String orderInfo, String clientIp) throws Exception {

        // Thời gian hiện tại theo GMT+7
        ZonedDateTime now        = ZonedDateTime.now(VIETNAM_ZONE);
        String vnpCreateDate     = now.format(VNP_DATE_FMT);
        String vnpExpireDate     = now.plusMinutes(15).format(VNP_DATE_FMT);

        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version",    "2.1.0");
        vnpParams.put("vnp_Command",    "pay");
        vnpParams.put("vnp_TmnCode",    config.tmnCode);
        vnpParams.put("vnp_Amount",     String.valueOf(amount * 100)); // VNPay nhân 100
        vnpParams.put("vnp_CurrCode",   "VND");
        vnpParams.put("vnp_TxnRef",     orderId);
        vnpParams.put("vnp_OrderInfo",  orderInfo);
        vnpParams.put("vnp_OrderType",  "other");
        vnpParams.put("vnp_Locale",     "vn");
        vnpParams.put("vnp_ReturnUrl",  config.returnUrl);
        vnpParams.put("vnp_IpAddr",     clientIp);
        vnpParams.put("vnp_CreateDate", vnpCreateDate);
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        // Build chuỗi hash và query — params đã sort A-Z nhờ TreeMap
        StringBuilder hashData = new StringBuilder();
        StringBuilder query    = new StringBuilder();

        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            String encodedValue = URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII);
            hashData.append(entry.getKey()).append('=').append(encodedValue).append('&');
            query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII))
                 .append('=').append(encodedValue).append('&');
        }
        // Xoá '&' cuối
        hashData.deleteCharAt(hashData.length() - 1);
        query.deleteCharAt(query.length() - 1);

        // Ký HMAC-SHA512
        String secureHash = hmacSHA512(config.hashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        return config.payUrl + "?" + query;
    }

    public boolean verifyReturn(Map<String, String> params) {
        String vnpSecureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        Map<String, String> sorted = new TreeMap<>(params);
        StringBuilder hashData = new StringBuilder();

        for (Map.Entry<String, String> entry : sorted.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                hashData.append(entry.getKey()).append('=')
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII))
                        .append('&');
            }
        }
        hashData.deleteCharAt(hashData.length() - 1);

        String checkHash = hmacSHA512(config.hashSecret, hashData.toString());
        return checkHash.equalsIgnoreCase(vnpSecureHash);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("HMAC-SHA512 error", e);
        }
    }

    public String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) ip = request.getRemoteAddr();
        if (ip.contains(",")) ip = ip.split(",")[0].trim();
        return ip;
    }
}
