package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /**
     * Lấy danh sách tableId đã được đặt trong khoảng thời gian [start, end)
     * Dùng JOIN vào TableEntity vì Reservation.table là @ManyToOne (không có field tableId riêng)
     */
    @Query("SELECT r.table.tableId FROM Reservation r WHERE r.reservationTime >= :start AND r.reservationTime < :end")
    List<Long> findTableIdsByReservationTimeBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
