package com.restaurant.backend.controller;

import com.restaurant.backend.entity.Reservation;
import com.restaurant.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setStatus("ACTIVE");
        return reservationRepository.save(reservation);
    }

    @PutMapping("/{id}/cancel")
    public Reservation cancelReservation(@PathVariable Long id) {
        Reservation reservation = reservationRepository
                .findById(id)
                .orElseThrow();

        reservation.setStatus("CANCELLED");

        return reservationRepository.save(reservation);
    }

    @PutMapping("/{id}/restore")
    public Reservation restoreReservation(@PathVariable Long id) {
        Reservation reservation = reservationRepository
                .findById(id)
                .orElseThrow();

        reservation.setStatus("ACTIVE");

        return reservationRepository.save(reservation);
    }
    @PutMapping("/{id}/complete")
    public Reservation completeReservation(@PathVariable Long id) {
        Reservation reservation = reservationRepository
                .findById(id)
                .orElseThrow();

        // Chuyển trạng thái thành COMPLETED (Hoàn thành)
        reservation.setStatus("COMPLETED");

        return reservationRepository.save(reservation);
    }
}