package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Tìm đặt bàn theo số điện thoại khách hàng
    List<Reservation> findByPhone(String phone);
}