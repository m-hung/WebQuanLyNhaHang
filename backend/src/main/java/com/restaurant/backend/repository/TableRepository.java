package com.restaurant.backend.repository;

import com.restaurant.backend.entity.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<TableEntity, Long> {
    // Tìm bàn theo trạng thái (ví dụ: "Trống")
    List<TableEntity> findByStatus(String status);
}