package com.restaurant.backend.controller;

import com.restaurant.backend.entity.TableEntity;
import com.restaurant.backend.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
// Cấu hình CrossOrigin để React (chạy ở cổng 5173) có thể gọi được API này
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
}