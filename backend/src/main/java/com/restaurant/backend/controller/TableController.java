package com.restaurant.backend.controller;

import com.restaurant.backend.entity.TableEntity;
import com.restaurant.backend.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class TableController {

    @Autowired
    private TableRepository tableRepository;

    @GetMapping
    public List<TableEntity> getAllTables() {
        return tableRepository.findAll();
    }

    @GetMapping("/status/{status}")
    public List<TableEntity> getTablesByStatus(@PathVariable String status) {
        return tableRepository.findByStatus(status);
    }

    // API mới thêm để khóa bàn
    @PutMapping("/{id}/status")
    public org.springframework.http.ResponseEntity<TableEntity> updateTableStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body) {
            
        // 1. Phải tìm (findById) cái bàn cũ trong Database ra trước
        return tableRepository.findById(id).map(table -> {
            
            // 2. Lấy status mới đè lên status cũ
            table.setStatus(body.get("status")); 
            
            // 3. Save lại (Lúc này Hibernate mới hiểu là UPDATE chứ không phải INSERT)
            return org.springframework.http.ResponseEntity.ok(tableRepository.save(table));
            
        }).orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());
    }
}