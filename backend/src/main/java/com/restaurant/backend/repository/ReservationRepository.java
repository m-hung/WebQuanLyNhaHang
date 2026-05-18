package com.restaurant.backend.repository;

import com.restaurant.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // QUAN TRỌNG: Phải có dòng này
import java.util.Optional;

@Repository // Annotation này giúp Spring nhận diện Bean
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    // Tìm đặt bàn theo mã paymentRef để cập nhật trạng thái thanh toán
    Optional<Reservation> findByPaymentRef(String paymentRef);
}