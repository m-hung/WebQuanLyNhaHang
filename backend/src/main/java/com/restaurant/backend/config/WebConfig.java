package com.restaurant.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:5173",          // Admin chạy ở local (Vite)
                    "http://127.0.0.1:5500",          // Client chạy ở local (Live Server VS Code nếu có)
                    "https://celestehouse.vercel.app", // Link thật của trang Client sau này
                    "https://celestehouse-admin.vercel.app"   // Link thật của trang Admin sau này
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);       // ← thêm dòng này
    }
}