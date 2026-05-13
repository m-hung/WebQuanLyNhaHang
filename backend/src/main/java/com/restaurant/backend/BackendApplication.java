package com.restaurant.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.annotation.PostConstruct; // Thêm dòng này
import java.util.TimeZone;               // Thêm dòng này

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        // Lệnh này khởi chạy toàn bộ hệ thống Spring Boot
        SpringApplication.run(BackendApplication.class, args);
    }

    // THÊM ĐOẠN NÀY ĐỂ ÉP MÚI GIỜ VIỆT NAM
    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
    }
}