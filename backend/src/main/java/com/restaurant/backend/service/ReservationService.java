package com.restaurant.backend.service;

import com.restaurant.backend.dto.VNPayCreateRequest;
import com.restaurant.backend.entity.Reservation;
import com.restaurant.backend.entity.TableEntity;
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
     * Gọi sau khi VNPay xác nhận thanh toán thành công.
     */
    public Reservation confirmReservation(VNPayCreateRequest req, String transactionNo) {
        Reservation r = new Reservation();

        r.setCustomerName(req.getCustomerName());
        r.setPhone(req.getPhone());
        r.setEmail(req.getEmail());
        r.setGuestCount(req.getGuestCount() != 0 ? req.getGuestCount() : null);
        r.setIsPaid(true);
        r.setPaymentRef(req.getOrderId());
        r.setTransactionNo(transactionNo);

        // Parse reservationTime
        if (req.getReservationTime() != null && !req.getReservationTime().isEmpty()) {
            r.setReservationTime(LocalDateTime.parse(req.getReservationTime()));
        }

        // Tìm TableEntity theo tableId
        if (req.getTableId() != null && !req.getTableId().isEmpty()) {
            try {
                Long tableId = Long.parseLong(req.getTableId());
                tableRepository.findById(tableId).ifPresent(r::setTable);
            } catch (NumberFormatException ignored) {}
        }

        return reservationRepository.save(r);
    }
}
