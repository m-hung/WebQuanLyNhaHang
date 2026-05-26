package com.restaurant.backend.controller;

import com.restaurant.backend.entity.TableEntity;
import com.restaurant.backend.repository.TableRepository;
import com.restaurant.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class TableController {

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping
    public List<TableEntity> getAllTables() {
        return tableRepository.findAll();
    }

    @GetMapping("/status/{status}")
    public List<TableEntity> getTablesByStatus(@PathVariable String status) {
        return tableRepository.findByStatus(status);
    }

    /**
     * API tìm bàn trống theo thời gian và số khách
     * GET /api/tables/available?datetime=2025-07-20T19:00:00&guests=2
     */
    @GetMapping("/available")
    public List<TableEntity> getAvailableTables(
            @RequestParam String datetime,
            @RequestParam int guests) {

        LocalDateTime requestedTime = LocalDateTime.parse(datetime);
        LocalDateTime windowStart = requestedTime.minusHours(1);
        LocalDateTime windowEnd   = requestedTime.plusHours(1);

        // Lấy danh sách tableId đã bị đặt trong khung giờ đó
        // Query dùng r.table.tableId vì Reservation dùng @ManyToOne
        List<Long> bookedTableIds = reservationRepository
                .findTableIdsByReservationTimeBetween(windowStart, windowEnd);

        return tableRepository.findAll().stream()
                .filter(table -> {
                    int cap = table.getCapacity();
                    if (guests <= 2) return cap == 2;
                    if (guests <= 4) return cap == 4;
                    return cap >= 6;
                })
                .filter(table -> !bookedTableIds.contains(table.getTableId())) // dùng getTableId() đúng với entity
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TableEntity> updateTableStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return tableRepository.findById(id).map(table -> {
            table.setStatus(body.get("status"));
            return ResponseEntity.ok(tableRepository.save(table));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
