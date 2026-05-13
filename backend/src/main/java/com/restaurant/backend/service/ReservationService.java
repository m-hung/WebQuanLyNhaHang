package com.restaurant.backend.service;

import com.restaurant.backend.dto.VNPayCreateRequest;
import com.restaurant.backend.entity.Reservation;
import com.restaurant.backend.repository.ReservationRepository;
import com.restaurant.backend.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TableRepository tableRepository;

    /**
     * Tạo mới Reservation sau khi thanh toán thành công
     */
    public Reservation createNewReservationAfterPayment(VNPayCreateRequest req, String transactionNo) {
        Reservation r = new Reservation();

        // Map dữ liệu từ Request (lấy từ Cache) sang Entity
        r.setCustomerName(req.getCustomerName());
        r.setPhone(req.getPhone());
        r.setEmail(req.getEmail());
        r.setGuestCount(req.getGuestCount());
        r.setIsPaid(true); // Luôn true vì thanh toán xong mới gọi
        r.setPaymentRef(req.getOrderId());
        r.setTransactionNo(transactionNo);

        // Parse thời gian đặt bàn
        if (req.getReservationTime() != null && !req.getReservationTime().isEmpty()) {
            r.setReservationTime(LocalDateTime.parse(req.getReservationTime()));
        }

        // Tìm và gán bàn
        if (req.getTableId() != null && !req.getTableId().isEmpty()) {
            try {
                Long tableId = Long.parseLong(req.getTableId());
                tableRepository.findById(tableId).ifPresent(r::setTable);
            } catch (Exception ignored) {}
        }

        // Lưu MỚI vào Database
        return reservationRepository.save(r);
    }
}