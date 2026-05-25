package com.restaurant.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
public class BackendApplication {

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
    }

    public static void main(String[] args) {
        // Lệnh này khởi chạy toàn bộ hệ thống Spring Boot
        SpringApplication.run(BackendApplication.class, args);
    }
}