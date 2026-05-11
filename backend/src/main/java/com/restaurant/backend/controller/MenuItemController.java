package com.restaurant.backend.controller;

import com.restaurant.backend.entity.MenuItem;
import com.restaurant.backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuItemController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @GetMapping
    public List<MenuItem> getAllItems() {
        return menuItemRepository.findAll();
    }

    @GetMapping("/available")
    public List<MenuItem> getAvailableItems() {
        return menuItemRepository.findByIsAvailableTrue();
    }

    @PostMapping
    public MenuItem addMenuItem(@RequestBody MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    @PutMapping("/{id}")
    public MenuItem updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItemDetails) {
        return menuItemRepository.findById(id).map(item -> {
            item.setName(menuItemDetails.getName());
            item.setDescription(menuItemDetails.getDescription());
            item.setPrice(menuItemDetails.getPrice());
            item.setDiscount(menuItemDetails.getDiscount());
            item.setImageUrl(menuItemDetails.getImageUrl());
            item.setIsAvailable(menuItemDetails.getIsAvailable());
            item.setCategory(menuItemDetails.getCategory());
            return menuItemRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy ID: " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        try {
            menuItemRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}