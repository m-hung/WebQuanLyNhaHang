package com.restaurant.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone; // Giữ lại mỗi cái này thôi

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));

        // Lệnh này khởi chạy toàn bộ hệ thống Spring Boot
        SpringApplication.run(BackendApplication.class, args);
    }
}